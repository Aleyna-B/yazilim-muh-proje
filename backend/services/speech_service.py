import os
import uuid
from gtts import gTTS
import speech_recognition as sr
from pydub import AudioSegment
from config import Config

class SpeechService:
    @staticmethod
    def text_to_speech(text, language='tr'):
        """
        Convert text to speech and save as MP3 file
        Returns the path to the generated audio file
        """
        # Create unique filename
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        
        # Generate speech
        tts = gTTS(text=text, lang=language, slow=False)
        tts.save(filepath)
        
        return filename
    
    @staticmethod
    def speech_to_text(audio_file, language='tr-TR'):
        """
        Convert speech to text from an audio file
        Returns the recognized text
        """
        recognizer = sr.Recognizer()
        
        # Convert file to WAV if it's not already
        file_path = os.path.join(Config.UPLOAD_FOLDER, audio_file)
        file_extension = os.path.splitext(audio_file)[1].lower()
        
        if file_extension != '.wav':
            # Convert to WAV
            audio = AudioSegment.from_file(file_path)
            wav_path = os.path.join(Config.UPLOAD_FOLDER, f"{uuid.uuid4()}.wav")
            audio.export(wav_path, format="wav")
            file_path = wav_path
        
        # Recognize speech
        with sr.AudioFile(file_path) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data, language=language)
                return text
            except sr.UnknownValueError:
                return "Speech could not be understood"
            except sr.RequestError:
                return "Could not request results from speech recognition service" 