from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.compression_routes import compression_bp
from routes.conversion_routes import conversion_bp
from config.settings import Config
import logging
import sys

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler('app.log')
        ]
    )
    
    # Register blueprints
    app.register_blueprint(compression_bp)
    app.register_blueprint(conversion_bp, url_prefix='/api/convert')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET', 'OPTIONS'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Service is running'
        })
    
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
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        logging.warning(f"404 error: {request.url}")
        return jsonify({
            'error': 'Not found',
            'message': 'The requested URL was not found on the server'
        }), 404

    @app.errorhandler(500)
    def internal_error(error):
        logging.error(f"500 error: {str(error)}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'Something went wrong on the server'
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)