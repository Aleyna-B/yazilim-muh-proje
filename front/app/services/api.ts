import axios from 'axios';

const API_URL = 'http://192.168.1.101:5000/api';



export interface UserResponse {
  _id: string;
  name: string;
  surname: string;
  phone_number: string;
}

export interface BusStop {
  stop_id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface Bus {
  arrival_time: string;
  features: string;
  line_name: string;
  line_no: string;
  plate: string;
  stop_order: string;
  vehicle_no: string;
}

export interface BusLocationResponse {
  bus_line: string;
  buses: Bus[];
  stop_id: string;
}

export interface BusLocationTtsResponse {
  audio_url: string;
  bus_line: string;
  buses: Bus[];
  stop_id: string;
  text: string;
}

export interface NearbyStopsResponse {
  message: string;
  stops: BusStop[];
}

export interface NearbyStopsTtsResponse {
  audio_url: string;
  stops: BusStop[];
  text: string;
}

// API service
const apiService = {
  // Register a new user
  registerUser: async (name: string, surname: string, phoneNumber: string) => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name,
        surname,
        phone_number: phoneNumber
      });
      
      // Transform backend response to match our ApiResponse interface
      return {
        success: response.status === 201,
        data: response.data.user,
        message: response.data.message
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response received from server. Please check your internet connection.');
        } else {
          // Something happened in setting up the request
          throw new Error(`Request error: ${error.message}`);
        }
      }
      // For non-Axios errors
      throw error;
    }
  },
  
  // Get nearby bus stops
  getNearbyStops: async (lat: number, lon: number, radius?: number) => {
    try {
      const url = `${API_URL}/stops/nearby`;
      const params: Record<string, string | number> = { lat, lon };
      
      // Add radius parameter if provided
      if (radius) {
        params.radius = radius;
      }
      
      const response = await axios.get<NearbyStopsResponse>(url, { params });
      
      return {
        success: true,
        data: response.data.stops,
        message: response.data.message
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response) {
          throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response received from server. Please check your internet connection.');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },
  
  // Get nearby bus stops with text-to-speech
  getNearbyStopsTts: async (lat: number, lon: number, radius?: number) => {
    try {
      const url = `${API_URL}/stops/nearby-tts`;
      const params: Record<string, string | number> = { lat, lon };
      
      // Add radius parameter if provided
      if (radius) {
        params.radius = radius;
      }
      
      const response = await axios.get<NearbyStopsTtsResponse>(url, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Nearby stops with audio retrieved successfully'
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response) {
          throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response received from server. Please check your internet connection.');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },
  
  // Get bus location information
  getBusLocation: async (stopId: string, busLine?: string) => {
    try {
      const url = `${API_URL}/buses/location`;
      const params: Record<string, string> = { stop_id: stopId };
      
      // Add bus_line parameter if provided
      if (busLine && busLine.trim() !== '') {
        params.bus_line = busLine;
      }
      
      const response = await axios.get<BusLocationResponse>(url, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Bus location information retrieved successfully'
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response) {
          throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response received from server. Please check your internet connection.');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },
  
  // Get bus location with text-to-speech audio
  getBusLocationTts: async (stopId: string, busLine?: string) => {
    try {
      const url = `${API_URL}/buses/location-tts`;
      const params: Record<string, string> = { stop_id: stopId };
      
      // Add bus_line parameter if provided
      if (busLine && busLine.trim() !== '') {
        params.bus_line = busLine;
      }
      
      const response = await axios.get<BusLocationTtsResponse>(url, { params });
      
      return {
        success: true,
        data: response.data,
        message: 'Bus location information with audio retrieved successfully'
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios errors
        if (error.response) {
          throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
        } else if (error.request) {
          throw new Error('No response received from server. Please check your internet connection.');
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
      throw error;
    }
  },
  
  // Add more API methods here as needed
};

export default apiService; 