from bson import ObjectId

class User:
    def __init__(self, name, surname, phone_number, voice_response_status=False, _id=None):
        self.name = name
        self.surname = surname
        self.phone_number = phone_number
        self.voice_response_status = voice_response_status
        self._id = _id if _id else ObjectId()
    
    def to_dict(self):
        return {
            "_id": str(self._id),
            "name": self.name,
            "surname": self.surname,
            "phone_number": self.phone_number,
            "voice_response_status": self.voice_response_status
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data.get("name"),
            surname=data.get("surname"),
            phone_number=data.get("phone_number"),
            voice_response_status=data.get("voice_response_status", False),
            _id=data.get("_id")
        ) 