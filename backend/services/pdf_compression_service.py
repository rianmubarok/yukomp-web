import os
from io import BytesIO
import fitz  # PyMuPDF
from config.settings import Config
import logging
from PIL import Image
import io
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PdfCompressionService:
    @staticmethod
    def compress_pdf(file):
        """Compress PDF file using PyMuPDF with aggressive compression settings"""
        temp_path = None
        try:
            # Create a temporary file to store the uploaded PDF
            temp_path = os.path.join(Config.UPLOAD_FOLDER, 'temp.pdf')
            file.save(temp_path)

            # Get original file size
            original_size = os.path.getsize(temp_path) / (1024 * 1024)  # Convert to MB
            logger.info(f"Original PDF size: {original_size:.2f} MB")

            # Open the PDF
            doc = fitz.open(temp_path)
            logger.info("Successfully opened PDF file")
            
            # Create a new PDF with compression
            output = BytesIO()
            new_doc = fitz.open()
            logger.info("Created new PDF document")

            # Process each page
            for page_num, page in enumerate(doc):
                logger.info(f"Processing page {page_num + 1}")
                # Get the page
                new_page = new_doc.new_page(width=page.rect.width, height=page.rect.height)
                
                # Get all images on the page
                image_list = page.get_images()
                logger.info(f"Found {len(image_list)} images on page {page_num + 1}")
                
                # Process each image
                for img_index, img in enumerate(image_list):
                    try:
                        xref = img[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        
                        # Convert to PIL Image for processing
                        image = Image.open(io.BytesIO(image_bytes))
                        
                        # Compress image
                        img_byte_arr = io.BytesIO()
                        image.save(img_byte_arr, format='JPEG', quality=30, optimize=True)
                        img_byte_arr = img_byte_arr.getvalue()
                        
                        # Replace the image in the PDF
                        new_doc.update_stream(xref, img_byte_arr)
                        logger.info(f"Compressed image {img_index + 1} on page {page_num + 1}")
                    except Exception as img_error:
                        logger.error(f"Error processing image {img_index + 1} on page {page_num + 1}: {str(img_error)}")
                        continue
                
                # Copy page content
                new_page.show_pdf_page(new_page.rect, doc, page.number)
                
                # Compress page content
                new_page.clean_contents()
                logger.info(f"Compressed page {page_num + 1} content")

            logger.info("Starting final PDF compression")
            # Set compression parameters (only supported ones)
            new_doc.save(
                output,
                garbage=4,  # Maximum garbage collection
                deflate=True,  # Use deflate compression
                clean=True,  # Clean redundant elements
                pretty=False,  # Don't pretty print
                ascii=False,  # Use binary encoding
                expand=0,  # Don't expand compressed objects
            )
            logger.info("Completed final PDF compression")

            # Close documents
            doc.close()
            new_doc.close()

            # Get compressed size
            output.seek(0)
            compressed_size = len(output.getvalue()) / (1024 * 1024)  # Convert to MB
            logger.info(f"Compressed PDF size: {compressed_size:.2f} MB")
            
            # Calculate compression ratio
            compression_ratio = (1 - (compressed_size / original_size)) * 100
            logger.info(f"Compression ratio: {compression_ratio:.2f}%")

            return output
        except Exception as e:
            logger.error(f"Error compressing PDF: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise Exception(f"Error compressing PDF: {str(e)}")
        finally:
            # Clean up temporary file if it exists
            if temp_path and os.path.exists(temp_path):
                try:
                    # Make sure file is not open before deleting
                    os.remove(temp_path)
                    logger.info("Cleaned up temporary file")
                except Exception as cleanup_error:
                    logger.error(f"Error cleaning up temporary file: {str(cleanup_error)}") 