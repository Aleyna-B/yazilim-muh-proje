import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'
    
    # MongoDB settings
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb+srv://umtcnzn:gb31dyaV4z3AWbLh@cluster0.z8pram5.mongodb.net/ego_app?retryWrites=true&w=majority')
    
    # Upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload 