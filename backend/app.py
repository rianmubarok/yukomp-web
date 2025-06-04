from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from routes.compression_routes import compression_bp
from routes.conversion_routes import conversion_bp
from config.settings import Config
from PIL import Image
import io
import os
from datetime import datetime

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(compression_bp)
    app.register_blueprint(conversion_bp, url_prefix='/api/convert')
    
    # Root route
    @app.route('/')
    def home():
        return jsonify({
            'status': 'success',
            'message': 'Yukomp API is running',
            'endpoints': {
                'image_compression': '/api/compress/image',
                'pdf_compression': '/api/compress/pdf',
                'jpg_to_pdf': '/api/convert/jpg-to-pdf'
            }
        })
    
    @app.route('/api/health', methods=['GET', 'OPTIONS'])
    def health_check():
        if request.method == 'OPTIONS':
            return '', 200
        return jsonify({"status": "healthy"}), 200

    @app.route('/api/db-health', methods=['GET', 'OPTIONS'])
    def db_health_check():
        if request.method == 'OPTIONS':
            return '', 200
        try:
            # Add your database connection check here
            # For now, we'll just return healthy
            return jsonify({"status": "healthy"}), 200
        except Exception as e:
            return jsonify({"status": "unhealthy", "error": str(e)}), 500

    @app.route('/api/file-service-health', methods=['GET', 'OPTIONS'])
    def file_service_health_check():
        if request.method == 'OPTIONS':
            return '', 200
        try:
            # Add your file service check here
            # For now, we'll just return healthy
            return jsonify({"status": "healthy"}), 200
        except Exception as e:
            return jsonify({"status": "unhealthy", "error": str(e)}), 500

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not found',
            'message': 'The requested URL was not found on the server'
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal server error',
            'message': 'Something went wrong on the server'
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)