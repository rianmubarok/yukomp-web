import os
from werkzeug.utils import secure_filename
from config.settings import Config

def allowed_file(filename, allowed_extensions):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def secure_file_name(filename):
    """Secure the filename to prevent security issues"""
    return secure_filename(filename)

def get_file_extension(filename):
    """Get file extension from filename"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else None 