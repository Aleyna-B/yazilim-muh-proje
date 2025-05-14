from bson import ObjectId

class Stop:
    def __init__(self, name, location_lat, location_lng, _id=None):
        self.name = name
        self.location_lat = location_lat
        self.location_lng = location_lng
        self._id = _id if _id else ObjectId()
    
    def to_dict(self):
        return {
            "_id": str(self._id),
            "name": self.name,
            "location_lat": self.location_lat,
            "location_lng": self.location_lng
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data.get("name"),
            location_lat=data.get("location_lat"),
            location_lng=data.get("location_lng"),
            _id=data.get("_id")
        ) 