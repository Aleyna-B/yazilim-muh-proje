import os
from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from services.speech_service import SpeechService
from config import Config

speech_bp = Blueprint('speech', __name__)

# Ensure upload directory exists
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)

@speech_bp.route('/tts', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    
    # Validate input
    if 'text' not in data:
        return jsonify({"error": "Missing text field"}), 400
    
    language = data.get('language', 'tr')
    
    # Convert text to speech
    filename = SpeechService.text_to_speech(data['text'], language)
    
    # Return file URL
    file_url = f"/api/speech/audio/{filename}"
    
    return jsonify({
        "message": "Text converted to speech",
        "audio_url": file_url
    }), 200

@speech_bp.route('/stt', methods=['POST'])
def speech_to_text():
    # Check if file is present in request
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    
    if audio_file.filename == '':
        return jsonify({"error": "No audio file selected"}), 400
    
    # Save uploaded file
    filename = secure_filename(audio_file.filename)
    filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
    audio_file.save(filepath)
    
    # Get language parameter
    language = request.form.get('language', 'tr-TR')
    
    # Convert speech to text
    text = SpeechService.speech_to_text(filename, language)
    
    return jsonify({
        "message": "Speech converted to text",
        "text": text
    }), 200

@speech_bp.route('/audio/<filename>', methods=['GET'])
def get_audio(filename):
    """Serve audio files"""
    return send_from_directory(Config.UPLOAD_FOLDER, filename) 