import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, BackHandler, Platform } from 'react-native';
import { useLocation } from './context/location';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function TargetScreen() {
  const router = useRouter();
  const { currentLocation, address } = useLocation();
  const [routeInfo, setRouteInfo] = useState('Hedef bilgisi bekleniyor...');

  // Hardware back button handling
  useEffect(() => {
    const backAction = () => {
      router.push('/route');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [router]);

  // Burada konum bilgilerini kullanarak backend'den rota bilgisi alınabilir
  useEffect(() => {
    if (currentLocation) {
      // Örnek: Backend'e istek atılabilir
      // const fetchRoute = async () => {
      //   try {
      //     const response = await fetch('YOUR_BACKEND_URL/route', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({
      //         startLat: currentLocation.coords.latitude,
      //         startLng: currentLocation.coords.longitude,
      //         targetLocation: 'Hedef konum bilgisi'
      //       })
      //     });
      //     const data = await response.json();
      //     setRouteInfo(data.routeDescription);
      //   } catch (error) {
      //     console.error('Rota bilgisi alınamadı:', error);
      //   }
      // };
      // fetchRoute();

      // Şimdilik örnek bir bilgi gösterelim
      setRouteInfo(`Konumunuzdan (${address || 'bilinmeyen konum'}) hedef noktaya gitmek için rota bilgisi burada gösterilecektir.`);
    }
  }, [currentLocation, address]);

  return (
    <View style={styles.container}>
      {/* Status bar için ek padding */}
      <View style={styles.statusBarPadding} />
      
      <Text style={styles.title}>HEDEFİNİZ</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{"\n"}
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{"\n"}
          aaaaaaaaaaaaaaaaaaaaaaa
        </Text>
      </View>
      <Text style={styles.infoText}>(TABİKİ SESLİ SÖYLÜYOR AMA{"\n"}YAZILI DA OLUYOR)</Text>
      <Text style={styles.subtitle}>NASIL GİDİLİR?</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>{routeInfo}</Text>
        {currentLocation && (
          <Text style={styles.coordsText}>
            Başlangıç Koordinatları: {`${currentLocation.coords.latitude.toFixed(6)}, ${currentLocation.coords.longitude.toFixed(6)}`}
          </Text>
        )}
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
    marginBottom: 18,
    color: '#000',
    textAlign: 'center',
  },
  box: {
    width: width * 0.88,
    minHeight: 80,
    backgroundColor: '#FFFDE7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    padding: 16,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  boxText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#111',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 18,
  },
  coordsText: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'SpaceMono',
  },
}); 