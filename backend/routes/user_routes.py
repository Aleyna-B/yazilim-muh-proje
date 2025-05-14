from flask import Blueprint, request, jsonify
from services.user_service import UserService

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ['name', 'surname', 'phone_number']):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Create user
    user, error = UserService.create_user(
        name=data['name'],
        surname=data['surname'],
        phone_number=data['phone_number']
    )
    
    if error:
        return jsonify({"error": error}), 400
    
    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict()
    }), 201

@user_bp.route('/profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    user = UserService.get_user_by_id(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

@user_bp.route('/voice-response/<user_id>', methods=['PUT'])
def update_voice_response(user_id):
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({"error": "Missing status field"}), 400
    
    success = UserService.update_voice_response_status(user_id, data['status'])
    
    if not success:
        return jsonify({"error": "Failed to update voice response status"}), 400
    
    return jsonify({"message": "Voice response status updated successfully"}), 200

 