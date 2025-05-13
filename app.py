from flask import Flask,Blueprint
from tts.routes_tts import tts_bp
from stt.routes_stt import stt_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.register_blueprint(tts_bp)
app.register_blueprint(stt_bp)

if __name__ == "__main__":
    app.run(debug=True)
