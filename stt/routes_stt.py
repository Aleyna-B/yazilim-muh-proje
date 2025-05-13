from flask import Blueprint, request, jsonify
import speech_recognition as sr
from pydub import AudioSegment
import os

stt_bp = Blueprint('stt_bp', __name__)

@stt_bp.route('/api/stt', methods=['POST'])
def speech_to_text():
    if 'file' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio_file = request.files['file']
    audio_path = "temp_audio.m4a"
    audio_file.save(audio_path)

    # Convert m4a to wav
    try:
        sound = AudioSegment.from_file(audio_path, format="m4a")
        wav_path = "temp_audio.wav"
        sound.export(wav_path, format="wav")
    except Exception as e:
        return jsonify({"error": f"Audio conversion failed: {str(e)}"}), 500

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
        finally:
            os.remove(audio_path)
            os.remove(wav_path)

