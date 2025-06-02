import os
from io import BytesIO
from PyPDF2 import PdfReader, PdfWriter
from config.settings import Config

class PdfCompressionService:
    @staticmethod
    def compress_pdf(file):
        """Compress PDF file"""
        try:
            # Create a temporary file to store the uploaded PDF
            temp_path = os.path.join(Config.UPLOAD_FOLDER, 'temp.pdf')
            file.save(temp_path)

            # Read the PDF
            reader = PdfReader(temp_path)
            writer = PdfWriter()

            # Copy pages to new PDF
            for page in reader.pages:
                # Note: PyPDF2's simple copy doesn't aggressively compress
                # For advanced PDF compression, a dedicated library like PyMuPDF might be needed
                writer.add_page(page)

            # Create a BytesIO object to store the compressed PDF
            output = BytesIO()
            writer.write(output)
            output.seek(0)

            # Clean up temporary file
            os.remove(temp_path)

            return output
        except Exception as e:
            # Clean up temporary file if it exists
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise Exception(f"Error compressing PDF: {str(e)}") 