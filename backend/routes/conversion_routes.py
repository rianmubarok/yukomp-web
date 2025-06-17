from flask import Blueprint, jsonify, request, send_file
from PIL import Image
import io
from datetime import datetime
from utils.file_utils import allowed_file, secure_filename
from config.settings import Config
import logging

conversion_bp = Blueprint('conversion', __name__)

def process_image(file):
    """Process a single image file for PDF conversion."""
    try:
        img = Image.open(file.stream)
        
        # Convert to RGB if necessary
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Standard A4 width at 200 DPI
        standard_width = 1654
        margin = 50
        
        # Resize maintaining aspect ratio
        aspect_ratio = img.height / img.width
        new_height = int((standard_width - (2 * margin)) * aspect_ratio)
        img = img.resize((standard_width - (2 * margin), new_height), Image.Resampling.LANCZOS)
        
        # Add margins
        new_img = Image.new('RGB', (standard_width, new_height + (2 * margin)), (255, 255, 255))
        new_img.paste(img, (margin, margin))
        
        return new_img
    except Exception as e:
        logging.error(f"Error processing image {file.filename}: {str(e)}")
        raise

@conversion_bp.route('/jpg-to-pdf', methods=['POST'])
def jpg_to_pdf():
    try:
        if 'files' not in request.files:
            logging.warning("No files provided in request")
            return jsonify({
                'error': 'No files provided',
                'message': 'Please provide image files to convert'
            }), 400

        files = request.files.getlist('files')
        if not files:
            logging.warning("Empty files list in request")
            return jsonify({
                'error': 'No files selected',
                'message': 'Please select at least one image file'
            }), 400

        # Process images
        images = []
        invalid_files = []
        for file in files:
            if file.filename == '':
                invalid_files.append("Empty filename")
                continue
                
            if not allowed_file(file.filename, Config.ALLOWED_IMAGE_EXTENSIONS):
                invalid_files.append(f"Invalid file type: {file.filename}")
                continue
                
            try:
                processed_image = process_image(file)
                images.append(processed_image)
                logging.info(f"Successfully processed image: {file.filename}")
            except Exception as e:
                logging.error(f"Failed to process image {file.filename}: {str(e)}")
                invalid_files.append(f"Processing failed: {file.filename}")

        if not images:
            logging.error(f"No valid images processed. Invalid files: {invalid_files}")
            return jsonify({
                'error': 'No valid images',
                'message': 'No valid image files were provided',
                'details': invalid_files
            }), 400

        # Create PDF
        pdf_buffer = io.BytesIO()
        images[0].save(
            pdf_buffer,
            format='PDF',
            save_all=True,
            append_images=images[1:] if len(images) > 1 else [],
            resolution=200.0,
            quality=90
        )
        pdf_buffer.seek(0)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'converted_{timestamp}.pdf'
        
        logging.info(f"Successfully created PDF with {len(images)} images")
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        logging.error(f"Unexpected error in jpg-to-pdf conversion: {str(e)}")
        return jsonify({
            'error': 'Conversion failed',
            'message': str(e)
        }), 500 