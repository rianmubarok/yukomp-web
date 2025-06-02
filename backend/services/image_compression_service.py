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
    def compress_image(file):
        """Compress image file with size-based logic"""
        try:
            # Read the image
            logger.info(f"Starting compression for file: {file.filename}")
            image = Image.open(file)
            
            # Get original dimensions
            width, height = image.size
            logger.info(f"Original dimensions: {width}x{height}")

            # Get original size in MB
            original_size = file.seek(0, os.SEEK_END) / (1024 * 1024) # Convert bytes to MB
            file.seek(0) # Reset file pointer to the beginning
            logger.info(f"Original size: {original_size:.2f} MB")

            # Set initial quality and target size based on original size
            if original_size > 1:
                quality = 85
                target_size_mb = original_size * 0.3  # Target 30% of original size
            elif original_size >= 0.5:
                quality = 75
                target_size_mb = original_size * 0.4  # Target 40% of original size
            elif original_size >= 0.1:  # 100KB (0.1 MB) - 500KB (0.5 MB)
                quality = 85
                target_size_mb = original_size * 0.6  # Target 60% of original size
            else:  # < 100KB (0.1 MB)
                quality = 90
                target_size_mb = original_size * 0.8  # Target 80% of original size

            logger.info(f"Initial quality: {quality}, Target size: {target_size_mb:.2f} MB")

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

            def compress_with_params(img, qual, target_size, max_attempts=3):  # Reduced max attempts
                """Helper function to compress image with given parameters"""
                best_output = None
                best_size = float('inf')
                attempts = 0
                current_quality = qual
                current_width, current_height = img.size

                while attempts < max_attempts:
                    try:
                        compressed_output = BytesIO()
                        
                        if output_format == 'PNG':
                            # For PNG, use optimize=True and compress_level
                            if img.mode == 'RGB' and current_quality < 70:
                                # Reduce colors for better compression
                                colors = max(256, int(256 * (current_quality / 100)))
                                img_quantized = img.quantize(colors=colors, method=2)
                                img_quantized.save(compressed_output, format='PNG', optimize=True, compress_level=6)  # Reduced compression level
                            else:
                                img.save(compressed_output, format='PNG', optimize=True, compress_level=6)  # Reduced compression level
                        else:
                            # For JPEG, we use quality parameter
                            img.save(compressed_output, format='JPEG', quality=current_quality, optimize=True)
                        
                        compressed_output.seek(0)
                        compressed_size = compressed_output.getbuffer().nbytes / (1024 * 1024)  # Convert to MB
                        logger.info(f"Attempt {attempts + 1}: Size = {compressed_size:.2f} MB, Quality = {current_quality}")

                        # If this is the best compression so far, save it
                        if compressed_size < best_size:
                            best_size = compressed_size
                            best_output = compressed_output
                            best_output.seek(0)

                        # If we've achieved target size, we're done
                        if compressed_size <= target_size:
                            logger.info(f"Target size achieved: {compressed_size:.2f} MB")
                            break

                        # If we haven't achieved target size, try different approaches
                        if output_format == 'PNG':
                            # For PNG, try resizing if the image is large
                            if current_width > 1920 or current_height > 1920:
                                ratio = min(1920/current_width, 1920/current_height)
                                new_width = int(current_width * ratio)
                                new_height = int(current_height * ratio)
                                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                                current_width, current_height = new_width, new_height
                                logger.info(f"Resized to {new_width}x{new_height}")
                            else:
                                # If we can't resize further, try reducing quality
                                current_quality = max(20, current_quality - 20)  # Larger quality reduction
                        else:
                            # For JPEG, reduce quality
                            current_quality = max(20, current_quality - 20)  # Larger quality reduction

                        attempts += 1
                    except Exception as e:
                        logger.error(f"Error in compression attempt {attempts + 1}: {str(e)}")
                        if best_output is not None:
                            return best_output, best_size
                        raise

                return best_output, best_size

            try:
                # First attempt with initial parameters
                logger.info("Starting first compression attempt")
                compressed_output, compressed_size = compress_with_params(image, quality, target_size_mb)

                # If compressed size is larger than original, try more aggressive compression
                if compressed_size >= original_size:
                    logger.info("First attempt failed, trying more aggressive compression")
                    # Try with more aggressive parameters
                    if output_format == 'PNG':
                        # For PNG, try with smaller dimensions
                        if width > 1280 or height > 1280:
                            ratio = min(1280/width, 1280/height)
                            new_width = int(width * ratio)
                            new_height = int(height * ratio)
                            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                            logger.info(f"Resized to {new_width}x{new_height}")
                    else:
                        # For JPEG, try with lower quality
                        quality = 60

                    compressed_output, compressed_size = compress_with_params(image, quality, target_size_mb)

                # If still larger than original, try one last time with minimum quality
                if compressed_size >= original_size:
                    logger.info("Second attempt failed, trying minimum quality")
                    if output_format == 'PNG':
                        # For PNG, try with even smaller dimensions
                        if width > 800 or height > 800:
                            ratio = min(800/width, 800/height)
                            new_width = int(width * ratio)
                            new_height = int(height * ratio)
                            image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                            logger.info(f"Resized to {new_width}x{new_height}")
                    else:
                        # For JPEG, use minimum quality
                        quality = 10

                    compressed_output, compressed_size = compress_with_params(image, quality, target_size_mb)

                # If still larger than original, return original image
                if compressed_size >= original_size:
                    logger.info("All compression attempts failed, returning original image")
                    file.seek(0)
                    return BytesIO(file.read())

                logger.info(f"Compression successful. Final size: {compressed_size:.2f} MB")
                return compressed_output

            except Exception as e:
                logger.error(f"Error during compression: {str(e)}")
                # If compression fails, return original image
                file.seek(0)
                return BytesIO(file.read())

        except Exception as e:
            logger.error(f"Critical error in compression: {str(e)}")
            raise Exception(f"Error compressing image: {str(e)}") 