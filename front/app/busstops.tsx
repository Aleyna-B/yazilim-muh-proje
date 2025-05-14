import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLocation } from './context/location';
import apiService, { Bus, BusStop } from './services/api';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.36;
const STATUSBAR_HEIGHT = Constants.statusBarHeight;
const BASE_API_URL = 'http://192.168.1.101:5000';

export default function BusStopsScreen() {
  const [stopNumber, setStopNumber] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [nearbyStops, setNearbyStops] = useState<BusStop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStopsList, setShowStopsList] = useState(false);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [showBuses, setShowBuses] = useState(false);
  const [announceText, setAnnounceText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const soundRef = useRef<Audio.Sound | null>(null);
  const router = useRouter();
  const { currentLocation, loading: locationLoading } = useLocation();

  // Clean up sound when component unmounts
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Set up audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Audio setup error:", error);
      }
    };
    
    setupAudio();
  }, []);

  // Hardware back button handling
  useEffect(() => {
    const backAction = () => {
      if (showBuses) {
        setShowBuses(false);
        return true;
      }
      if (showStopsList) {
        setShowStopsList(false);
        return true;
      }
      router.push('/menu');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [router, showStopsList, showBuses]);

  // Yakındaki durakları getir (TTS ile)
  const fetchNearbyStops = async () => {
    if (!currentLocation) {
      Alert.alert(
        "Konum Bulunamadı",
        "Yakındaki durakları görebilmek için konum izni vermeniz gerekmektedir.",
        [{ text: "Tamam", style: "default" }]
      );
      return;
    }

    try {
      setIsLoading(true);
      const { latitude, longitude } = currentLocation.coords;
      // TTS endpoint kullan
      const response = await apiService.getNearbyStopsTts(latitude, longitude, 200);
      
      if (response.success && response.data) {
        setNearbyStops(response.data.stops);
        setAnnounceText(response.data.text);
        setShowStopsList(true);
        
        // Save and play audio
        if (response.data.audio_url) {
          setAudioUrl(response.data.audio_url);
          playAudio(response.data.audio_url);
        }
      } else {
        Alert.alert("Hata", response.message || "Duraklar yüklenirken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Yakındaki duraklar yüklenirken hata:", error);
      Alert.alert(
        "Hata",
        "Yakındaki duraklar yüklenirken bir sorun oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Play TTS audio
  const playAudio = async (url: string) => {
    try {
      // Stop and unload previous sound if exists
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      if (!url) {
        console.error("Geçersiz ses URL'i");
        return;
      }

      setIsPlaying(true);
      
      // Create full URL if needed
      const fullUrl = url.startsWith('http') ? url : `${BASE_API_URL}${url}`;
      console.log("Playing audio from URL:", fullUrl);
      
      // Load and play new sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: fullUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          } else if (status.error) {
            console.error("Audio playback error:", status.error);
            setIsPlaying(false);
          }
        }
      );
      
      soundRef.current = sound;
    } catch (error) {
      console.error("Ses çalınırken hata oluştu:", error);
      setIsPlaying(false);
      Alert.alert(
        "Ses Hatası",
        "Ses çalınamadı. Lütfen tekrar deneyin."
      );
    }
  };

  // Stop audio playback
  const stopAudio = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
      } catch (error) {
        console.error("Ses durdurulurken hata:", error);
      }
      setIsPlaying(false);
    }
  };

  // Otobüs nerede işlevi - TTS ile
  const findBusLocation = async () => {
    // Durak numarası tam olarak 5 haneli olmalı
    if (!stopNumber || stopNumber.length !== 5 || !/^\d{5}$/.test(stopNumber)) {
      Alert.alert(
        "Hata",
        "Lütfen geçerli bir 5 haneli durak numarası girin.",
        [{ text: "Tamam", style: "default" }]
      );
      return;
    }

    try {
      setIsLoading(true);
      // TTS ile otobüs bilgisi al
      const response = await apiService.getBusLocationTts(stopNumber, busNumber);
      
      if (response.success && response.data) {
        setBuses(response.data.buses);
        setAnnounceText(response.data.text);
        setShowBuses(true);
        
        // Save audio URL for later playback
        if (response.data.audio_url) {
          setAudioUrl(response.data.audio_url);
          // Play audio
          playAudio(response.data.audio_url);
        }
      } else {
        Alert.alert("Hata", response.message || "Otobüs bilgileri yüklenirken bir sorun oluştu.");
      }
    } catch (error) {
      console.error("Otobüs bilgileri yüklenirken hata:", error);
      Alert.alert(
        "Hata",
        "Otobüs bilgileri yüklenirken bir sorun oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Durak öğesi render fonksiyonu
  const renderStopItem = ({ item }: { item: BusStop }) => (
    <TouchableOpacity 
      style={styles.stopItem}
      accessible={true}
      accessibilityLabel={`${item.name} durağı, durak numarası ${item.stop_id}`}
      onPress={() => {
        setStopNumber(item.stop_id);
        setShowStopsList(false);
      }}
    >
      <View style={styles.stopIconContainer}>
        <Image 
          source={require('../assets/images/bus.png')} 
          style={styles.stopIcon} 
          resizeMode="contain"
        />
      </View>
      <View style={styles.stopDetails}>
        <Text style={styles.stopName}>{item.name}</Text>
        <Text style={styles.stopId}>Durak No: {item.stop_id}</Text>
      </View>
    </TouchableOpacity>
  );

  // Otobüs render fonksiyonu
  const renderBusItem = ({ item }: { item: Bus }) => (
    <View style={styles.busItem}>
      <View style={styles.busHeader}>
        <Text style={styles.busLineNo}>{item.line_no}</Text>
        <Text style={styles.busPlate}>{item.plate}</Text>
      </View>
      <Text style={styles.busLineName}>{item.line_name}</Text>
      <View style={styles.busDetails}>
        <Text style={styles.busArrival}>{item.arrival_time}</Text>
        <Text style={styles.busFeatures}>{item.features}</Text>
        <Text style={styles.busStopOrder}>Durak: {item.stop_order}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status bar için ek padding */}
      <View style={styles.statusBarPadding} />
      
      <Text style={styles.title}>OTOBÜS NEREDE</Text>

      {showStopsList ? (
        <View style={styles.stopsListContainer}>
          <Text style={styles.stopsListTitle}>YAKINDAKİ DURAKLAR</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#0084FF" style={styles.loader} />
          ) : (
            <>
              {/* Sesli duyuru bölümü */}
              <View style={styles.announcementContainer}>
                <Text style={styles.announcementText}>{announceText}</Text>
                
                <View style={styles.audioControls}>
                  <TouchableOpacity 
                    style={[styles.audioButton, isPlaying ? styles.audioButtonActive : null]}
                    onPress={isPlaying ? stopAudio : () => audioUrl ? playAudio(audioUrl) : null}
                    disabled={!audioUrl}
                  >
                    <Text style={styles.audioButtonText}>
                      {isPlaying ? "DURDUR" : "DİNLE"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {nearbyStops.length > 0 ? (
                <FlatList
                  data={nearbyStops}
                  renderItem={renderStopItem}
                  keyExtractor={(item) => item.stop_id}
                  contentContainerStyle={styles.stopsList}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>Yakında durak bulunamadı.</Text>
                </View>
              )}
            </>
          )}
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setShowStopsList(false);
              stopAudio();
              setAudioUrl('');
            }}
            accessible={true}
            accessibilityLabel="Geri dön"
          >
            <Text style={styles.backButtonText}>GERİ</Text>
          </TouchableOpacity>
        </View>
      ) : showBuses ? (
        <View style={styles.busesListContainer}>
          <Text style={styles.busesListTitle}>OTOBÜS BİLGİLERİ</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#0084FF" style={styles.loader} />
          ) : (
            <>
              {/* Sesli duyuru kontrolleri */}
              <View style={styles.announcementContainer}>
                <Text style={styles.announcementText}>{announceText}</Text>
                
                <View style={styles.audioControls}>
                  <TouchableOpacity 
                    style={[styles.audioButton, isPlaying ? styles.audioButtonActive : null]}
                    onPress={isPlaying ? stopAudio : () => audioUrl ? playAudio(audioUrl) : null}
                    disabled={!audioUrl}
                  >
                    <Text style={styles.audioButtonText}>
                      {isPlaying ? "DURDUR" : "DİNLE"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {buses.length > 0 ? (
                <FlatList
                  data={buses}
                  renderItem={renderBusItem}
                  keyExtractor={(item, index) => `${item.line_no}-${item.vehicle_no}-${index}`}
                  contentContainerStyle={styles.busesList}
                />
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>Bu durağa yaklaşan otobüs bulunamadı.</Text>
                </View>
              )}
            </>
          )}
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setShowBuses(false);
              stopAudio();
              setAudioUrl('');
            }}
            accessible={true}
            accessibilityLabel="Geri dön"
          >
            <Text style={styles.backButtonText}>GERİ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Arama kutusu ve kutu arka planı */}
          <View style={styles.searchBoxWrapper}>
            <View style={styles.searchInputRow}>
              <TextInput
                style={styles.searchInput}
                value={stopNumber}
                onChangeText={(text) => {
                  // Sadece rakam ve maksimum 5 karakter
                  if (/^\d{0,5}$/.test(text)) {
                    setStopNumber(text);
                  }
                }}
                placeholder="Durak numarası girin (5 haneli)"
                placeholderTextColor="#222"
                keyboardType="numeric"
                maxLength={5}
                accessibilityLabel="Durak numarası girin"
              />
              {stopNumber.length > 0 && (
                <TouchableOpacity onPress={() => setStopNumber('')} style={styles.clearButton} accessibilityLabel="Temizle">
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={[styles.searchInputRow, {marginTop: 16}]}>
              <TextInput
                style={styles.searchInput}
                value={busNumber}
                onChangeText={(text) => {
                  // Sadece rakam
                  if (/^\d*$/.test(text)) {
                    setBusNumber(text);
                  }
                }}
                placeholder="Otobüs numarası girin (opsiyonel)"
                placeholderTextColor="#222"
                keyboardType="numeric"
                accessibilityLabel="Otobüs numarası girin"
              />
              {busNumber.length > 0 && (
                <TouchableOpacity onPress={() => setBusNumber('')} style={styles.clearButton} accessibilityLabel="Temizle">
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Otobüs Nerede butonu */}
            <TouchableOpacity 
              style={styles.findBusButton}
              onPress={findBusLocation}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel="Otobüs nerede"
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.findBusButtonText}>OTOBÜS NEREDE</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {/* Alt butonlar */}
          <View style={styles.bottomButtonsRow}>
            <View style={styles.menuButtonContainer}>
              <TouchableOpacity 
                style={[styles.menuButton, { backgroundColor: '#0084FF' }]}
                onPress={fetchNearbyStops}
                disabled={isLoading || locationLoading}
                accessible={true}
                accessibilityLabel="Yakındaki duraklar"
                accessibilityRole="button"
              > 
                {isLoading || locationLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Image 
                    source={require('../assets/images/bus.png')} 
                    style={styles.menuIcon} 
                    resizeMode="contain"
                    accessible={true}
                    accessibilityLabel="Otobüs ikonu"
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.menuLabel}>YAKINDAKİ{"\n"}DURAKLAR</Text>
            </View>
          </View>
        </>
      )}
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
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: STATUSBAR_HEIGHT + 20,
    color: '#000',
    textAlign: 'center',
  },
  searchBoxWrapper: {
    width: width * 0.92,
    height: width * 0.65,
    backgroundColor: '#eaf4fd',
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 32,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    alignSelf: 'center',
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.07)",
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    backgroundColor: 'transparent',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
  },
  findBusButton: {
    backgroundColor: '#FFC107',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 16,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  findBusButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
    marginBottom: 16,
  },
  menuButtonContainer: {
    alignItems: 'center',
    marginHorizontal: 18,
  },
  menuButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 4,
  },
  menuIcon: {
    width: BUTTON_SIZE * 0.5,
    height: BUTTON_SIZE * 0.5,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 6,
  },
  stopsListContainer: {
    flex: 1,
    width: width * 0.92,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#eaf4fd',
    borderRadius: 16,
    padding: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  stopsListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  stopsList: {
    paddingBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  stopIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0084FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stopIcon: {
    width: 30,
    height: 30,
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  stopId: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#FFC107',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'center',
    marginTop: 16,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 32,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  busesListContainer: {
    flex: 1,
    width: width * 0.92,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: '#eaf4fd',
    borderRadius: 16,
    padding: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  busesListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  busesList: {
    paddingBottom: 16,
  },
  busItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  busLineNo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0084FF',
  },
  busPlate: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  busLineName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
  },
  busDetails: {
    marginTop: 4,
  },
  busArrival: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFC107',
    marginBottom: 4,
  },
  busFeatures: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  busStopOrder: {
    fontSize: 14,
    color: '#666',
  },
  announcementContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    elevation: 2,
  },
  announcementText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 12,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  audioButton: {
    backgroundColor: '#0084FF',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  audioButtonActive: {
    backgroundColor: '#FFC107',
  },
  audioButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 