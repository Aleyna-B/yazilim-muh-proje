# EGO App Backend

Flask REST API for the EGO application with text-to-speech and speech-to-text capabilities.

## Features

- User registration
- Bus stops management
- Favorite stops for users
- Text-to-Speech conversion
- Speech-to-Text conversion
- MongoDB integration

## Requirements

- Python 3.8+
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Copy `env.example` to `.env` and configure your environment variables
4. Run the application:
   ```
   python app.py
   ```

## API Endpoints

### User Management

- `POST /api/users/register` - Register a new user
- `GET /api/users/profile/<user_id>` - Get user profile
- `PUT /api/users/voice-response/<user_id>` - Update voice response status

### Stops

- `GET /api/stops` - Get all stops
- `GET /api/stops/<stop_id>` - Get stop by ID
- `GET /api/stops/search?name=<query>` - Search stops by name
- `GET /api/stops/nearby?lat=<latitude>&lon=<longitude>&radius=<meters>` - Get nearby bus stops
- `GET /api/stops/nearby-tts?lat=<latitude>&lon=<longitude>&radius=<meters>&language=<language>` - Get nearby bus stops with text-to-speech audio
- `POST /api/stops` - Create a new stop

### Favorites

- `GET /api/favorites/user/<user_id>` - Get user's favorite stops
- `POST /api/favorites` - Add stop to favorites (requires user_id and stop_id)
- `DELETE /api/favorites/<user_id>/<stop_id>` - Remove stop from favorites

### Speech

- `POST /api/speech/tts` - Convert text to speech
- `POST /api/speech/stt` - Convert speech to text
- `GET /api/speech/audio/<filename>` - Get audio file

### Bus Information

- `GET /api/buses/location?stop_id=<stop_id>&bus_line=<bus_line>` - Get real-time bus location information
- `GET /api/buses/location-tts?stop_id=<stop_id>&bus_line=<bus_line>&language=<language>` - Get real-time bus location with text-to-speech audio

## Database Schema

### Users
- user_id (PK)
- name
- surname
- phone_number
- voice_response_status

### Stops
- stop_id (PK)
- name
- location_lat
- location_lng

### FavoriteStops
- id (PK)
- user_id (FK)
- stop_id (FK) 