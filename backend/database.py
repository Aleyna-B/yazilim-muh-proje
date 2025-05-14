from pymongo import MongoClient
from config import Config

# Create a MongoDB client
client = MongoClient(Config.MONGO_URI)

# Get the database
db = client.get_database()

# Define collections
users_collection = db.users
stops_collection = db.stops
favorite_stops_collection = db.favorite_stops 