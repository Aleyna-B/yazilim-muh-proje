from flask import Blueprint, request, jsonify
from services.bus_service import BusService
from services.speech_service import SpeechService

bus_bp = Blueprint('bus', __name__)

@bus_bp.route('/location', methods=['GET'])
def get_bus_location():
    # Get parameters from request
    stop_id = request.args.get('stop_id', '')
    bus_line = request.args.get('bus_line', '')
    
    if not stop_id:
        return jsonify({"error": "Missing stop_id parameter"}), 400
    
    # Get bus location information
    bus_info = BusService.get_bus_location(stop_id, bus_line)
    
    # Check if error occurred
    if isinstance(bus_info, dict) and "error" in bus_info:
        return jsonify(bus_info), 404
    
    return jsonify({
        "stop_id": stop_id,
        "bus_line": bus_line if bus_line else "All lines",
        "buses": bus_info
    }), 200

@bus_bp.route('/location-tts', methods=['GET'])
def get_bus_location_with_tts():
    # Get parameters from request
    stop_id = request.args.get('stop_id', '')
    bus_line = request.args.get('bus_line', '')
    
    if not stop_id:
        return jsonify({"error": "Missing stop_id parameter"}), 400
    
    # Get bus location information
    bus_info = BusService.get_bus_location(stop_id, bus_line)
    
    # Generate summary text for the first 3 buses
    summary_text = BusService.generate_arrival_summary(bus_info, stop_id)
    
    # Convert summary to speech
    language = request.args.get('language', 'tr')
    filename = SpeechService.text_to_speech(summary_text, language)
    
    # Return file URL
    file_url = f"/api/speech/audio/{filename}"
    
    # Check if error occurred with bus info
    if isinstance(bus_info, dict) and "error" in bus_info:
        return jsonify({
            "message": "Error fetching bus information",
            "error": bus_info["error"],
            "text": summary_text,
            "audio_url": file_url
        }), 404
    
    # Take only the first 3 buses for response
    buses_to_show = bus_info[:3] if len(bus_info) > 3 else bus_info
    
    return jsonify({
        "stop_id": stop_id,
        "bus_line": bus_line if bus_line else "All lines",
        "buses": buses_to_show,
        "text": summary_text,
        "audio_url": file_url
    }), 200 