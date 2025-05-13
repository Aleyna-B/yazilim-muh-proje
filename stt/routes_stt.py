from flask import Blueprint, request, jsonify
import speech_recognition as sr
from pydub import AudioSegment
import os

stt_bp = Blueprint('stt_bp', __name__)

@stt_bp.route('/api/stt', methods=['POST'])
def speech_to_text():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files['audio']
    audio_path = "temp_audio.mp3"
    audio_file.save(audio_path)

    # Convert mp3 to wav
    sound = AudioSegment.from_mp3(audio_path)
    wav_path = "temp_audio.wav"
    sound.export(wav_path, format="wav")

    # Speech recognition
    recognizer = sr.Recognizer()
    with sr.AudioFile(wav_path) as source:
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio, language="tr-TR")
            return jsonify({"text": text})
        except sr.UnknownValueError:
            return jsonify({"error": "Could not understand audio"}), 400
        except sr.RequestError as e:
            return jsonify({"error": str(e)}), 500
