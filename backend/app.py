from flask import Flask
from flask_cors import CORS
from config import Config
from routes.user_routes import user_bp
from routes.stop_routes import stop_bp
from routes.speech_routes import speech_bp
from routes.favorite_routes import favorite_bp
from routes.bus_routes import bus_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(stop_bp, url_prefix='/api/stops')
    app.register_blueprint(speech_bp, url_prefix='/api/speech')
    app.register_blueprint(favorite_bp, url_prefix='/api/favorites')
    app.register_blueprint(bus_bp, url_prefix='/api/buses')
    
    @app.route('/')
    def index():
        return {'message': 'EGO API is running'}
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True) 