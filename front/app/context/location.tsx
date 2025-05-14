import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as Location from 'expo-location';

// Konum verilerini ve fonksiyonlarını içeren interface tipi
interface LocationContextType {
  currentLocation: Location.LocationObject | null;
  address: string | null;
  loading: boolean;
  error: string | null;
  updateLocation: (location: Location.LocationObject) => void;
  updateAddress: (address: string) => void;
  updateError: (error: string) => void;
  setLoading: (isLoading: boolean) => void;
  clearLocationData: () => void;
}

// Default değerler
const defaultContext: LocationContextType = {
  currentLocation: null,
  address: null,
  loading: false,
  error: null,
  updateLocation: () => {},
  updateAddress: () => {},
  updateError: () => {},
  setLoading: () => {},
  clearLocationData: () => {},
};

// Context'i oluştur
const LocationContext = createContext<LocationContextType>(defaultContext);

// Context'i kullanmak için hook
export const useLocation = () => useContext(LocationContext);

// Provider component
export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = (location: Location.LocationObject) => {
    setCurrentLocation(location);
  };

  const updateAddress = (newAddress: string) => {
    setAddress(newAddress);
  };

  const updateError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const clearLocationData = () => {
    setCurrentLocation(null);
    setAddress(null);
    setError(null);
  };

  const value = {
    currentLocation,
    address,
    loading,
    error,
    updateLocation,
    updateAddress,
    updateError,
    setLoading,
    clearLocationData,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}; 