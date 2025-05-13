from flask import Flask, request, send_file, Blueprint, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()

ELEVEN_API_KEY = os.getenv("ELEVENLABS_TTS_KEY")
VOICE_ID = "RXCCWbOxP7Hisa63Xsv5"  # Calm Turkish AudioGuide sesi

tts_bp = Blueprint("tts", __name__)

@tts_bp.route("/api/tts", methods=["POST"])
def tts():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Text field is required."}), 400

    text = data.get("text", "")

    if not text:
        return {"error": "Text is required."}, 400

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        audio_path = "output.mp3"
        with open(audio_path, "wb") as f:
            f.write(response.content)
        return send_file(audio_path, mimetype="audio/mpeg")
    else:
        return {"error": "TTS failed", "details": response.text}, response.status_code