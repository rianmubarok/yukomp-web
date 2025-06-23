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
            logger.info(f"Starting compression for file: {file.filename}")
            file_content = file.read()
            original_size = len(file_content)
            file_stream = BytesIO(file_content)
            image = Image.open(file_stream)
            width, height = image.size
            logger.info(f"Original dimensions: {width}x{height}")
            logger.info(f"Original size: {original_size / (1024 * 1024):.2f} MB")

            # Set quality based on custom settings or default logic
            if settings and 'quality' in settings:
                quality = int(settings['quality'])
                logger.info(f"Using custom quality: {quality}")
            else:
                original_size_mb = original_size / (1024 * 1024)
                if original_size_mb > 1:
                    quality = 85
                elif original_size_mb >= 0.5:
                    quality = 75
                elif original_size_mb >= 0.1:
                    quality = 85
                else:
                    quality = 90
                logger.info(f"Using default quality: {quality}")

            is_png = file.filename.lower().endswith('.png')
            output_format = 'PNG' if is_png else 'JPEG'
            logger.info(f"Output format: {output_format}")

            # Handle different image modes
            if is_png:
                if image.mode == 'RGBA':
                    logger.info("Keeping transparency for PNG")
                elif image.mode == 'P':
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
                if image.mode == 'RGBA':
                    logger.info("Converting RGBA to RGB for JPEG")
                    background = Image.new('RGB', image.size, (255, 255, 255))
                    background.paste(image, mask=image.split()[3])
                    image = background
                elif image.mode != 'RGB':
                    logger.info(f"Converting {image.mode} to RGB")
                    image = image.convert('RGB')

            def compress_png_with_attempts(img, qual, orig_size, max_attempts=3):
                best_output = None
                best_size = float('inf')
                attempts = 0
                current_quality = qual
                current_width, current_height = img.size
                resize_steps = [1920, 1280, 800]
                resize_idx = 0
                while attempts < max_attempts:
                    try:
                        compressed_output = BytesIO()
                        temp_img = img
                        # Quantize jika kualitas rendah
                        if temp_img.mode == 'RGB' and current_quality < 70:
                            colors = max(256, int(256 * (current_quality / 100)))
                            temp_img = temp_img.quantize(colors=colors, method=2)
                        temp_img.save(compressed_output, format='PNG', optimize=True, compress_level=6)
                        compressed_output.seek(0)
                        compressed_size = len(compressed_output.getvalue())
                        logger.info(f"PNG Attempt {attempts+1}: Size = {compressed_size / (1024*1024):.2f} MB, Quality = {current_quality}")
                        if compressed_size < best_size:
                            best_size = compressed_size
                            best_output = BytesIO(compressed_output.getvalue())
                        # Jika sudah lebih kecil dari asli, selesai
                        if compressed_size < orig_size:
                            break
                        # Resize jika perlu
                        if resize_idx < len(resize_steps) and (current_width > resize_steps[resize_idx] or current_height > resize_steps[resize_idx]):
                            ratio = min(resize_steps[resize_idx]/current_width, resize_steps[resize_idx]/current_height)
                            new_width = int(current_width * ratio)
                            new_height = int(current_height * ratio)
                            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                            current_width, current_height = new_width, new_height
                            logger.info(f"Resized to {new_width}x{new_height}")
                            resize_idx += 1
                        else:
                            current_quality = max(20, current_quality - 20)
                        attempts += 1
                    except Exception as e:
                        logger.error(f"Error in PNG compression attempt {attempts+1}: {str(e)}")
                        if best_output is not None:
                            return best_output, best_size
                        raise
                return best_output, best_size

            compressed_output = None
            compressed_size = None
            if is_png:
                compressed_output, compressed_size = compress_png_with_attempts(image, quality, original_size)
                # Fallback: jika masih lebih besar, resize lebih kecil lagi
                if compressed_size >= original_size:
                    logger.info("All PNG compression attempts failed, returning original")
                    return BytesIO(file_content)
                return compressed_output
            else:
                # JPEG tetap seperti sebelumnya
                compressed_output = BytesIO()
                image.save(compressed_output, format='JPEG', quality=quality, optimize=True)
                compressed_output.seek(0)
                compressed_size = len(compressed_output.getvalue())
                logger.info(f"Compressed size: {compressed_size / (1024 * 1024):.2f} MB")
                if compressed_size >= original_size:
                    logger.info("Compression increased file size, returning original")
                    return BytesIO(file_content)
                return compressed_output
        except Exception as e:
            logger.error(f"Error compressing image: {str(e)}")
            raise Exception(f"Error compressing image: {str(e)}") 