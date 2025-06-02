from flask import Blueprint, request, send_file
from services.image_compression_service import ImageCompressionService
from services.pdf_compression_service import PdfCompressionService
from utils.file_utils import allowed_file, secure_filename
from config.settings import Config
import zipfile
from io import BytesIO

compression_bp = Blueprint('compression', __name__)

@compression_bp.route('/api/compress/image', methods=['POST'])
def compress_image():
    if 'files' not in request.files:
        return {'error': 'No files provided'}, 400
    
    files = request.files.getlist('files')
    if not files or all(f.filename == '' for f in files):
        return {'error': 'No selected file(s)'}, 400
    
    try:
        # If only one file is uploaded, return the compressed file directly
        if len(files) == 1:
            file = files[0]
            if not allowed_file(file.filename, Config.ALLOWED_IMAGE_EXTENSIONS):
                return {'error': 'File type not allowed'}, 400
            
            # Secure the filename
            filename = secure_filename(file.filename)
            
            # Compress the image
            compressed_data = ImageCompressionService.compress_image(file)
            
            # Return the compressed file
            return send_file(
                compressed_data,
                mimetype='image/jpeg',
                as_attachment=True,
                download_name=f'compressed_{filename}'
            )
        
        # For multiple files, create a zip archive
        zip_buffer = BytesIO()
        
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                if allowed_file(file.filename, Config.ALLOWED_IMAGE_EXTENSIONS):
                    # Secure the filename
                    filename = secure_filename(file.filename)
                    
                    # Compress the image
                    compressed_data = ImageCompressionService.compress_image(file)
                    
                    # Add compressed file to the zip archive
                    zip_file.writestr(f'compressed_{filename}', compressed_data.getvalue())
                else:
                    # Optionally handle disallowed files, e.g., skip or return an error
                    print(f"File {file.filename} not allowed, skipping.")

        # Move the buffer's position to the beginning before sending
        zip_buffer.seek(0)

        # Return the zip file
        return send_file(
            zip_buffer,
            mimetype='application/zip',
            as_attachment=True,
            download_name='compressed_images.zip'
        )
    except Exception as e:
        return {'error': str(e)}, 500

@compression_bp.route('/api/compress/pdf', methods=['POST'])
def compress_pdf():
    if 'file' not in request.files:
        return {'error': 'No file provided'}, 400
    
    file = request.files['file']
    if file.filename == '':
        return {'error': 'No file selected'}, 400
    
    if not allowed_file(file.filename, Config.ALLOWED_PDF_EXTENSIONS):
        return {'error': 'File type not allowed'}, 400
    
    try:
        # Secure the filename
        filename = secure_filename(file.filename)
        
        # Compress the PDF using the new service
        compressed_data = PdfCompressionService.compress_pdf(file)
        
        # Return the compressed file
        return send_file(
            compressed_data,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'compressed_{filename}'
        )
    except Exception as e:
        return {'error': str(e)}, 500 