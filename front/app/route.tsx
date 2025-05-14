import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, Alert, BackHandler, Platform } from 'react-native';
import { useLocation } from './context/location';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.48;
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function RouteScreen() {
  const router = useRouter();
  const [displayAddress, setDisplayAddress] = useState('Konum bilgisi alınıyor...');
  
  // Location context'ini kullan
  const { currentLocation, address, loading, error } = useLocation();

  // Hardware back button handling
  useEffect(() => {
    const backAction = () => {
      router.push('/menu');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [router]);

  // Context'ten adres bilgisi geldiğinde display state'ini güncelle
  useEffect(() => {
    if (address) {
      setDisplayAddress(address);
    }
  }, [address]);

  return (
    <View style={styles.container}>
      {/* Status bar için ek padding */}
      <View style={styles.statusBarPadding} />
      
      <Text style={styles.title}>NASIL GİDERİM?</Text>
      <Text style={styles.subtitle}>ŞU ANDA BURADASIN:</Text>
      
      {/* Konum bilgisi kutusu */}
      <View style={styles.locationBox}>
        <Text style={styles.locationText}>
          {loading ? 'Konum alınıyor...' : error ? 'Konum alınamadı' : displayAddress}
        </Text>
        {currentLocation && (
          <Text style={styles.coordsText}>
            {`Lat: ${currentLocation.coords.latitude.toFixed(6)}, Lng: ${currentLocation.coords.longitude.toFixed(6)}`}
          </Text>
        )}
      </View>
      
      <View style={styles.centeredContent}>
        <TouchableOpacity style={styles.targetButton} onPress={() => router.push('/target')}>
          <Image source={require('../assets/images/microphone.png')} style={styles.targetIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>HEDEF</Text>
        <TouchableOpacity style={styles.favButton} onPress={() => router.push('/favorites')}>
          <Image source={require('../assets/images/heart.png')} style={styles.favIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>FAVORİLERİM</Text>
      </View>
   
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusBarPadding: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationBox: {
    width: width * 0.88,
    minHeight: 50,
    backgroundColor: '#FFFDE7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
    fontWeight: '500',
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'SpaceMono',
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  targetButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 4,
  },
  favButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 4,
  },
  favIcon: {
    width: BUTTON_SIZE * 0.45,
    height: BUTTON_SIZE * 0.45,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
  },
  targetIcon: {
    width: BUTTON_SIZE * 0.45,
    height: BUTTON_SIZE * 0.45,
  },
}); 