from bson import ObjectId
from database import stops_collection
from models.stop import Stop
import requests



class StopService:
    @staticmethod
    def create_stop(name, location_lat, location_lng):
        # Create new stop
        stop = Stop(name=name, location_lat=location_lat, location_lng=location_lng)
        
        # Insert stop into database
        stops_collection.insert_one({
            "_id": stop._id,
            "name": stop.name,
            "location_lat": stop.location_lat,
            "location_lng": stop.location_lng
        })
        
        return stop
    
    @staticmethod
    def get_stop_by_id(stop_id):
        stop_data = stops_collection.find_one({"_id": ObjectId(stop_id)})
        if not stop_data:
            return None
        
        return Stop.from_dict(stop_data)
    
    @staticmethod
    def get_all_stops():
        stops = []
        for stop_data in stops_collection.find():
            stops.append(Stop.from_dict(stop_data))
        
        return stops
    
    @staticmethod
    def search_stops_by_name(name_query):
        stops = []
        # Case-insensitive search with regex
        for stop_data in stops_collection.find({"name": {"$regex": name_query, "$options": "i"}}):
            stops.append(Stop.from_dict(stop_data))
        
        return stops
    
    @staticmethod
    def get_nearby_stops(lat, lon, radius=400):
      
        overpass_url = "http://overpass-api.de/api/interpreter"
        query = f"""
        [out:json];
        node(around:{radius},{lat},{lon})[highway=bus_stop];
        out;
        """
        try:
            response = requests.post(overpass_url, data={"data": query})
            data = response.json()
            stops = [{
                "name": el.get("tags", {}).get("name", "Unnamed Stop"),
                "stop_id": el.get("tags", {}).get("ref", ""),
                "lat": el["lat"],
                "lon": el["lon"]
            } for el in data["elements"]]
            return stops
        except Exception as e:
            print(f"Error fetching nearby stops: {str(e)}")
            return []
    
    @staticmethod
    def generate_nearby_stops_summary(stops, lat, lon, radius=400):
        """
        Generate a text summary of the first 3 nearby stops
        
        Args:
            stops (list): List of nearby stops
            lat (float): Latitude of the user's location
            lon (float): Longitude of the user's location
            radius (int): Search radius in meters
            
        Returns:
            str: Summary text for text-to-speech
        """
        if not stops or len(stops) == 0:
            return f"Size {radius} metre yakınlıkta hiç durak bulunamadı."
        
        # Take only the first 3 stops
        stops_to_describe = stops[:3] if len(stops) > 3 else stops
        
        # Create introduction text
        if len(stops) == 1:
            summary = f"Size {radius} metre yakınlıkta 1 durak bulunuyor: "
        else:
            summary = f"Size {radius} metre yakınlıkta {len(stops)} durak bulunuyor. İlk 3 durak: "
        
        # Add information for each stop
        for i, stop in enumerate(stops_to_describe):
            stop_name = stop.get("name", "İsimsiz Durak")
            stop_id = stop.get("stop_id", "")
            
            # If this is not the first stop, add a separator
            if i > 0:
                summary += ". "
            
            # Add stop information with stop ID if available
            if stop_id:
                summary += f"{stop_name}, durak numarası {stop_id}"
            else:
                summary += f"{stop_name} durağı"
        
        return summary 