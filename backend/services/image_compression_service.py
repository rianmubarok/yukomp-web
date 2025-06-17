import os
import logging
from io import BytesIO
from PIL import Image
from config.settings import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ImageCompressionService:
    @staticmethod
    def compress_image(file, settings=None):
        """Compress image file with size-based logic"""
        try:
            # Read the image
            logger.info(f"Starting compression for file: {file.filename}")
            
            # Get original size in bytes
            file_content = file.read()
            original_size = len(file_content)
            
            # Create new BytesIO for image processing
            file_stream = BytesIO(file_content)
            image = Image.open(file_stream)
            
            # Get original dimensions
            width, height = image.size
            logger.info(f"Original dimensions: {width}x{height}")
            logger.info(f"Original size: {original_size / (1024 * 1024):.2f} MB")

            # Set quality based on custom settings or default logic
            if settings and 'quality' in settings:
                quality = int(settings['quality'])
                logger.info(f"Using custom quality: {quality}")
            else:
                # Default quality logic based on file size
                original_size_mb = original_size / (1024 * 1024)  # Convert to MB
                if original_size_mb > 1:
                    quality = 85
                elif original_size_mb >= 0.5:
                    quality = 75
                elif original_size_mb >= 0.1:
                    quality = 85
                else:
                    quality = 90
                logger.info(f"Using default quality: {quality}")

            # Determine output format based on original format
            is_png = file.filename.lower().endswith('.png')
            output_format = 'PNG' if is_png else 'JPEG'
            logger.info(f"Output format: {output_format}")

            # Handle different image modes
            if is_png:
                # For PNG, ensure we're using the most efficient mode
                if image.mode == 'RGBA':
                    logger.info("Keeping transparency for PNG")
                elif image.mode == 'P':
                    # Convert palette mode to RGBA if it has transparency
                    if 'transparency' in image.info:
                        logger.info("Converting palette PNG with transparency to RGBA")
                        image = image.convert('RGBA')
                    else:
                        logger.info("Converting palette PNG to RGB")
                        image = image.convert('RGB')
                elif image.mode != 'RGB':
                    logger.info(f"Converting {image.mode} to RGB")
                    image = image.convert('RGB')
            else:
                # For JPEG, convert RGBA to RGB
                if image.mode == 'RGBA':
                    logger.info("Converting RGBA to RGB for JPEG")
                    background = Image.new('RGB', image.size, (255, 255, 255))
                    background.paste(image, mask=image.split()[3])
                    image = background
                elif image.mode != 'RGB':
                    logger.info(f"Converting {image.mode} to RGB")
                    image = image.convert('RGB')

            # Compress the image
            compressed_output = BytesIO()
            
            if output_format == 'PNG':
                # For PNG, use optimize=True and compress_level
                if image.mode == 'RGB' and quality < 70:
                    # Reduce colors for better compression
                    colors = max(256, int(256 * (quality / 100)))
                    image = image.quantize(colors=colors, method=2)
                image.save(compressed_output, format='PNG', optimize=True, compress_level=6)
            else:
                # For JPEG, use quality parameter
                image.save(compressed_output, format='JPEG', quality=quality, optimize=True)

            compressed_output.seek(0)
            compressed_size = len(compressed_output.getvalue())
            logger.info(f"Compressed size: {compressed_size / (1024 * 1024):.2f} MB")

            # If compressed size is larger than original, return original
            if compressed_size >= original_size:
                logger.info("Compression increased file size, returning original")
                return BytesIO(file_content)

            return compressed_output

        except Exception as e:
            logger.error(f"Error compressing image: {str(e)}")
            raise Exception(f"Error compressing image: {str(e)}") 