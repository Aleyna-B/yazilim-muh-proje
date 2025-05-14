from flask import Blueprint, request, jsonify
from services.stop_service import StopService
from services.speech_service import SpeechService

stop_bp = Blueprint('stop', __name__)

@stop_bp.route('', methods=['POST'])
def create_stop():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ['name', 'location_lat', 'location_lng']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Create stop
    stop = StopService.create_stop(
        name=data['name'],
        location_lat=data['location_lat'],
        location_lng=data['location_lng']
    )
    
    return jsonify({
        "message": "Stop created successfully",
        "stop": stop.to_dict()
    }), 201

@stop_bp.route('', methods=['GET'])
def get_all_stops():
    stops = StopService.get_all_stops()
    return jsonify([stop.to_dict() for stop in stops]), 200

@stop_bp.route('/<stop_id>', methods=['GET'])
def get_stop(stop_id):
    stop = StopService.get_stop_by_id(stop_id)
    
    if not stop:
        return jsonify({"error": "Stop not found"}), 404
    
    return jsonify(stop.to_dict()), 200

@stop_bp.route('/search', methods=['GET'])
def search_stops():
    name_query = request.args.get('name', '')
    
    if not name_query:
        return jsonify({"error": "Missing name query parameter"}), 400
    
    stops = StopService.search_stops_by_name(name_query)
    return jsonify([stop.to_dict() for stop in stops]), 200

@stop_bp.route('/nearby', methods=['GET'])
def get_nearby_stops():
    # Get parameters from request
    try:
        lat = float(request.args.get('lat', ''))
        lon = float(request.args.get('lon', ''))
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude parameters"}), 400
    
    # Get optional radius parameter
    try:
        radius = int(request.args.get('radius', 400))
    except ValueError:
        radius = 400
    
    # Get nearby stops
    stops = StopService.get_nearby_stops(lat, lon, radius)
    
    return jsonify({
        "message": f"Found {len(stops)} stops within {radius}m",
        "stops": stops
    }), 200

@stop_bp.route('/nearby-tts', methods=['GET'])
def get_nearby_stops_with_tts():
    # Get parameters from request
    try:
        lat = float(request.args.get('lat', ''))
        lon = float(request.args.get('lon', ''))
    except ValueError:
        return jsonify({"error": "Invalid latitude or longitude parameters"}), 400
    
    # Get optional radius parameter
    try:
        radius = int(request.args.get('radius', 400))
    except ValueError:
        radius = 400
    
    # Get nearby stops
    stops = StopService.get_nearby_stops(lat, lon, radius)
    
    # Generate summary text for the nearby stops
    summary_text = StopService.generate_nearby_stops_summary(stops, lat, lon, radius)
    
    # Convert summary to speech
    language = request.args.get('language', 'tr')
    filename = SpeechService.text_to_speech(summary_text, language)
    
    # Return file URL
    file_url = f"/api/speech/audio/{filename}"
    
    # Take only the first 3 stops to highlight in response
    stops_to_show = stops[:3] if len(stops) > 3 else stops
    
    return jsonify({
        "message": f"Found {len(stops)} stops within {radius}m",
        "stops": stops,
        "featured_stops": stops_to_show,
        "text": summary_text,
        "audio_url": file_url
    }), 200 