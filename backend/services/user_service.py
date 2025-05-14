from bson import ObjectId
from database import users_collection
from models.user import User

class UserService:
    @staticmethod
    def create_user(name, surname, phone_number):
        # Check if user with phone number already exists
        if users_collection.find_one({"phone_number": phone_number}):
            return None, "User with this phone number already exists"
        
        # Create new user
        user = User(name=name, surname=surname, phone_number=phone_number)
        
        # Insert user into database
        users_collection.insert_one({
            "_id": user._id,
            "name": user.name,
            "surname": user.surname,
            "phone_number": user.phone_number,
            "voice_response_status": user.voice_response_status
        })
        
        return user, None
    
    @staticmethod
    def get_user_by_id(user_id):
        user_data = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user_data:
            return None
        
        return User.from_dict(user_data)
    
    @staticmethod
    def get_user_by_phone(phone_number):
        user_data = users_collection.find_one({"phone_number": phone_number})
        if not user_data:
            return None
        
        return User.from_dict(user_data)
    
    @staticmethod
    def update_voice_response_status(user_id, status):
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"voice_response_status": status}}
        )
        
        return result.modified_count > 0 