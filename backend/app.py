from flask import Flask, jsonify
from flask_cors import CORS
from routes.compression_routes import compression_bp
from config.settings import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(compression_bp)
    
    # Root route
    @app.route('/')
    def home():
        return jsonify({
            'status': 'success',
            'message': 'Yukomp API is running',
            'endpoints': {
                'image_compression': '/api/compress/image',
                'pdf_compression': '/api/compress/pdf'
            }
        })
    
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