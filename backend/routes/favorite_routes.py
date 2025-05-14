from flask import Blueprint, request, jsonify
from services.favorite_service import FavoriteService

favorite_bp = Blueprint('favorite', __name__)

@favorite_bp.route('', methods=['POST'])
def add_favorite():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ['user_id', 'stop_id']):
        return jsonify({"error": "Missing required fields"}), 400
    
    user_id = data['user_id']
    
    # Add favorite
    favorite, error = FavoriteService.add_favorite_stop(user_id, data['stop_id'])
    
    if error:
        return jsonify({"error": error}), 400
    
    return jsonify({
        "message": "Stop added to favorites",
        "favorite": favorite.to_dict()
    }), 201

@favorite_bp.route('/user/<user_id>', methods=['GET'])
def get_favorites(user_id):
    favorites = FavoriteService.get_user_favorite_stops(user_id)
    
    return jsonify(favorites), 200

@favorite_bp.route('/<user_id>/<stop_id>', methods=['DELETE'])
def remove_favorite(user_id, stop_id):
    success = FavoriteService.remove_favorite_stop(user_id, stop_id)
    
    if not success:
        return jsonify({"error": "Favorite not found or already removed"}), 404
    
    return jsonify({"message": "Stop removed from favorites"}), 200 