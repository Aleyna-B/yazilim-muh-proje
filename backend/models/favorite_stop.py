from bson import ObjectId

class FavoriteStop:
    def __init__(self, user_id, stop_id, _id=None):
        self.user_id = user_id
        self.stop_id = stop_id
        self._id = _id if _id else ObjectId()
    
    def to_dict(self):
        return {
            "_id": str(self._id),
            "user_id": str(self.user_id),
            "stop_id": str(self.stop_id)
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            user_id=data.get("user_id"),
            stop_id=data.get("stop_id"),
            _id=data.get("_id")
        ) 