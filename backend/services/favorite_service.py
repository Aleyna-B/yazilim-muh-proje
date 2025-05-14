from bson import ObjectId
from database import favorite_stops_collection, stops_collection
from models.favorite_stop import FavoriteStop
from models.stop import Stop

class FavoriteService:
    @staticmethod
    def add_favorite_stop(user_id, stop_id):
        # Check if favorite already exists
        existing = favorite_stops_collection.find_one({
            "user_id": str(user_id),
            "stop_id": str(stop_id)
        })
        
        if existing:
            return None, "Stop already in favorites"
        
        # Create new favorite
        favorite = FavoriteStop(user_id=user_id, stop_id=stop_id)
        
        # Insert favorite into database
        favorite_stops_collection.insert_one({
            "_id": favorite._id,
            "user_id": str(favorite.user_id),
            "stop_id": str(favorite.stop_id)
        })
        
        return favorite, None
    
    @staticmethod
    def remove_favorite_stop(user_id, stop_id):
        result = favorite_stops_collection.delete_one({
            "user_id": str(user_id),
            "stop_id": str(stop_id)
        })
        
        return result.deleted_count > 0
    
    @staticmethod
    def get_user_favorite_stops(user_id):
        favorites = []
        favorite_data = favorite_stops_collection.find({"user_id": str(user_id)})
        
        for fav in favorite_data:
            stop_id = fav["stop_id"]
            stop_data = stops_collection.find_one({"_id": ObjectId(stop_id)})
            
            if stop_data:
                stop = Stop.from_dict(stop_data)
                favorites.append({
                    "favorite_id": str(fav["_id"]),
                    "stop": stop.to_dict()
                })
        
        return favorites 