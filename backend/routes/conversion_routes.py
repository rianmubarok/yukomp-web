from flask import Blueprint, jsonify, request, send_file
from PIL import Image
import io
from datetime import datetime

conversion_bp = Blueprint('conversion', __name__)

@conversion_bp.route('/jpg-to-pdf', methods=['POST', 'OPTIONS'])
def jpg_to_pdf():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        if 'files' not in request.files:
            return jsonify({
                'error': 'No files provided',
                'message': 'Please provide image files to convert'
            }), 400

        files = request.files.getlist('files')
        if not files:
            return jsonify({
                'error': 'No files selected',
                'message': 'Please select at least one image file'
            }), 400

        # Create a list to store image objects
        images = []
        
        # Standard width for all images (A4 width in pixels at 200 DPI)
        standard_width = 1654  # A4 width at 200 DPI
        margin = 50  # Margin in pixels (25px * 2 for 200 DPI)
        
        # Process each image
        for file in files:
            if file.filename == '':
                continue
                
            # Read the image
            img = Image.open(file.stream)
            
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Calculate new height maintaining aspect ratio
            aspect_ratio = img.height / img.width
            new_height = int((standard_width - (2 * margin)) * aspect_ratio)
            
            # Resize image with high quality
            img = img.resize((standard_width - (2 * margin), new_height), Image.Resampling.LANCZOS)
            
            # Create a new image with margins
            new_img = Image.new('RGB', (standard_width, new_height + (2 * margin)), (255, 255, 255))
            new_img.paste(img, (margin, margin))
            
            images.append(new_img)

        if not images:
            return jsonify({
                'error': 'No valid images',
                'message': 'No valid image files were provided'
            }), 400

        # Create PDF in memory
        pdf_buffer = io.BytesIO()
        
        # Save first image as PDF with balanced resolution
        images[0].save(
            pdf_buffer,
            format='PDF',
            save_all=True,
            append_images=images[1:] if len(images) > 1 else [],
            resolution=200.0,
            quality=90
        )
        
        # Reset buffer position
        pdf_buffer.seek(0)
        
        # Generate filename
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'converted_{timestamp}.pdf'
        
        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        return jsonify({
            'error': 'Conversion failed',
            'message': str(e)
        }), 500 