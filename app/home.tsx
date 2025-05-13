import * as React from "react";
import { useEffect, useState, useRef} from 'react';
import axios from '../utils/axios';
import mime from 'mime';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from "react-native";

import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import { useAuth } from './context/auth';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, isLoading } = useAuth();

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recordingRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Mikrofon izni verilmedi');
      }
    })();
  }, []);

const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {}, // Web platformu için boş bir nesne
};

const handleMicPress = async () => {
  if (!listening) {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("İzin Gerekli", "Mikrofon erişimi için izin vermelisiniz.");
        return;
      }

      // Optional: file system/media permissions for Android < 11
      if (Platform.OS === 'android' && Platform.Version < 30) {
        const fsPermission = await MediaLibrary.requestPermissionsAsync();
        if (!fsPermission.granted) {
          Alert.alert("İzin Gerekli", "Dosya sistemine erişim izni verilmedi.");
          return;
        }
      }

      setListening(true);
      setTranscript("Dinleniyor...");

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(RECORDING_OPTIONS);
      await recording.startAsync();

      recordingRef.current = recording;

    } catch (error) {
      console.error("Ses kaydı başlatılamadı:", error);
      Alert.alert("Hata", "Ses kaydı başlatılamadı.");
      setListening(false);
    }

  } else {
    try {
      const recording = recordingRef.current;
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        if (!uri) {
          console.error("URI alınamadı.");
          Alert.alert("Hata", "Ses kaydı URI'si alınamadı.");
          return;
        }

        const fileType = mime.getType(uri) || 'audio/m4a';

        const formData = new FormData();
        formData.append('audio', {
          uri,
          name: `recording-${Date.now()}.m4a`,
          type: fileType,
        } as any);

        const response = await axios.post('api/stt', formData);

        console.log("STT Yanıtı:", response.data);
        setTranscript(response.data.text || "Yanıt alınamadı.");
      }
    } catch (error) {
      console.error("Ses kaydı durdurulamadı veya gönderilemedi:", error);
      Alert.alert("Hata", "Kayıt gönderilirken bir sorun oluştu.");
    } finally {
      setListening(false);
      recordingRef.current = null;
    }
  }
};

  const navigateToMenu = () => {
    router.push('/menu');
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Üst bilgi / Profil bilgisi */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.welcomeUserText}>
          Merhaba, {user.name} {user.surname}
        </Text>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={navigateToMenu}
          accessible={true}
          accessibilityLabel="Menü"
          accessibilityHint="Menüye gitmek için dokunun"
        >
          <Text style={styles.menuButtonText}>Menü</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Otobüs ve rota görseli */}
        <Image
          source={require('../assets/images/bus-route.png')}
          style={styles.busRoute}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="Otobüs ve rota görseli"
        />

        {/* Transkript Alanı */}
        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}

        {/* Mikrofon Butonu */}
        <TouchableOpacity
          onPress={handleMicPress}
          style={[
            styles.micButton,
            listening && styles.micButtonActive
          ]}
          accessible={true}
          accessibilityLabel="Mikrofon butonu"
          accessibilityHint="Sesli komut vermek için dokunun"
          accessibilityRole="button"
        >
          <Image
            source={require('../assets/images/microphone.png')}
            style={styles.micIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  welcomeUserText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#0084FF',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  menuButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  busRoute: {
    width: width * 0.7,
    height: height * 0.35,
    marginTop: 40,
  },
  transcriptContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    marginVertical: 20,
    minHeight: 80,
    justifyContent: "center",
  },
  transcriptText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
  },
  micButton: {
    marginTop: 40,
    backgroundColor: "#0084FF",
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  micButtonActive: {
    backgroundColor: "#FF3B30", // Aktif durumdaki renk (kırmızı)
  },
  micIcon: {
    width: 56,
    height: 56,
    tintColor: "#fff",
  }
}); 