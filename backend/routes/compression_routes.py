from flask import Blueprint, request, send_file, jsonify
from services.image_compression_service import ImageCompressionService
from services.pdf_compression_service import PdfCompressionService
from utils.file_utils import allowed_file, secure_filename
from config.settings import Config
import zipfile
from io import BytesIO
import os
import json
import tempfile
import io
import logging

compression_bp = Blueprint('compression', __name__)

def handle_compression(files, compression_service, allowed_extensions, file_type):
    if not files or all(f.filename == '' for f in files):
        return {'error': 'No selected file(s)'}, 400
    
    try:
        # Get custom settings if provided
        settings = {}
        if 'settings' in request.form:
            try:
                settings = json.loads(request.form['settings'])
            except json.JSONDecodeError:
                return {'error': 'Invalid settings format'}, 400

        # Single file handling
        if len(files) == 1:
            file = files[0]
            if not allowed_file(file.filename, allowed_extensions):
                return {'error': f'File type not allowed. Only {", ".join(allowed_extensions)} files are supported'}, 400
            
            filename = secure_filename(file.filename)
            original_size = file.seek(0, os.SEEK_END)
            file.seek(0)
            
            compressed_data = compression_service(file, settings)
            compressed_size = len(compressed_data.getvalue())
            
            response = send_file(
                compressed_data,
                mimetype=f'application/{file_type}',
                as_attachment=True,
                download_name=f'compressed_{filename}'
            )
            response.headers['X-Original-Size'] = str(original_size)
            response.headers['X-Compressed-Size'] = str(compressed_size)
            return response
        
        # Multiple files handling
        zip_buffer = BytesIO()
        size_info = []
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                if allowed_file(file.filename, allowed_extensions):
                    filename = secure_filename(file.filename)
                    original_size = file.seek(0, os.SEEK_END)
                    file.seek(0)
                    
                    compressed_data = compression_service(file, settings)
                    compressed_size = len(compressed_data.getvalue())
                    
                    zip_file.writestr(f'compressed_{filename}', compressed_data.getvalue())
                    size_info.append({
                        'filename': filename,
                        'originalSize': original_size,
                        'compressedSize': compressed_size
                    })
        
        zip_buffer.seek(0)
        response = send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name=f'compressed_{file_type}s.zip'
        )
        response.headers['X-Size-Info'] = json.dumps(size_info)
        return response
        
    except Exception as e:
        return {'error': str(e)}, 500

@compression_bp.route('/api/compress/image', methods=['POST'])
def compress_image():
    if 'files' not in request.files:
        return {'error': 'No files provided'}, 400
    
    files = request.files.getlist('files')
    return handle_compression(
        files, 
        ImageCompressionService.compress_image,
        Config.ALLOWED_IMAGE_EXTENSIONS,
        'image'
    )

@compression_bp.route('/api/compress/pdf', methods=['POST'])
def compress_pdf():
    if 'files' not in request.files:
        return {'error': 'No files provided'}, 400
    
    files = request.files.getlist('files')
    return handle_compression(
        files,
        PdfCompressionService.compress_pdf,
        Config.ALLOWED_PDF_EXTENSIONS,
        'pdf'
    )

@compression_bp.route("/compress", methods=["POST"])
def compress_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        files = request.files.getlist("file")
        if not files or files[0].filename == "":
            return jsonify({"error": "No selected file"}), 400

        file_type = request.form.get("fileType", "image")
        custom_settings = request.form.get("customSettings")
        settings = json.loads(custom_settings) if custom_settings else {}

        logger.info(f"Received compression request for {len(files)} files")
        logger.info(f"File type: {file_type}")
        logger.info(f"Custom settings: {settings}")

        if file_type == "pdf":
            compressed_files = []
            for file in files:
                if file and file.filename:
                    # Save the uploaded file temporarily
                    temp_input = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
                    file.save(temp_input.name)
                    temp_input.close()

                    # Compress the PDF
                    compressed_path = PdfCompressionService.compress_pdf(
                        temp_input.name, settings
                    )

                    # Read the compressed file
                    with open(compressed_path, "rb") as f:
                        compressed_files.append(f.read())

                    # Clean up temporary files
                    os.unlink(temp_input.name)
                    os.unlink(compressed_path)

            if len(compressed_files) == 1:
                return send_file(
                    io.BytesIO(compressed_files[0]),
                    mimetype="application/pdf",
                    as_attachment=True,
                    download_name="compressed.pdf",
                )
            else:
                # Create a ZIP file containing all compressed PDFs
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                    for i, compressed_data in enumerate(compressed_files):
                        zip_file.writestr(
                            f"compressed_{i+1}.pdf", compressed_data
                        )
                zip_buffer.seek(0)
                return send_file(
                    zip_buffer,
                    mimetype="application/zip",
                    as_attachment=True,
                    download_name="compressed_pdfs.zip",
                )

        else:  # image compression
            compressed_files = []
            compressed_sizes = {}
            
            for i, file in enumerate(files):
                if file and file.filename:
                    # Save the uploaded file temporarily
                    temp_input = tempfile.NamedTemporaryFile(delete=False)
                    file.save(temp_input.name)
                    temp_input.close()

                    # Get original file size
                    original_size = os.path.getsize(temp_input.name)
                    logger.info(f"Original file size: {original_size} bytes")

                    # Compress the image
                    compressed_path = ImageCompressionService.compress_image(
                        temp_input.name, settings
                    )

                    # Get compressed file size
                    compressed_size = os.path.getsize(compressed_path)
                    logger.info(f"Compressed file size: {compressed_size} bytes")
                    
                    # Store compressed size
                    compressed_sizes[file.filename] = compressed_size

                    # Read the compressed file
                    with open(compressed_path, "rb") as f:
                        compressed_files.append(f.read())

                    # Clean up temporary files
                    os.unlink(temp_input.name)
                    os.unlink(compressed_path)

            if len(compressed_files) == 1:
                response = send_file(
                    io.BytesIO(compressed_files[0]),
                    mimetype="image/jpeg",
                    as_attachment=True,
                    download_name="compressed.jpg",
                )
                # Add compressed size to response headers
                response.headers['X-Compressed-Size'] = str(compressed_sizes[files[0].filename])
                return response
            else:
                # Create a ZIP file containing all compressed images
                zip_buffer = io.BytesIO()
                with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                    for i, (compressed_data, original_file) in enumerate(zip(compressed_files, files)):
                        zip_file.writestr(
                            f"compressed_{i+1}.jpg", compressed_data
                        )
                        # Add compressed size to response headers
                        response.headers[f'X-Compressed-Size-{i}'] = str(compressed_sizes[original_file.filename])
                zip_buffer.seek(0)
                return send_file(
                    zip_buffer,
                    mimetype="application/zip",
                    as_attachment=True,
                    download_name="compressed_images.zip",
                )

    except Exception as e:
        logger.error(f"Error in compress_file: {str(e)}")
        return jsonify({"error": str(e)}), 500 