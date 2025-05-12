import * as React from "react";
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
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Kullanıcı veri tipi
interface UserData {
  name: string;
  surname: string;
  phoneNumber: string;
}

export default function HomeScreen() {
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const [userData, setUserData] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    // Kullanıcı verilerini yükle
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken hata:', error);
    }
  };

  const handleMicPress = () => {
    // Mikrofon dinleme durumunu değiştir
    setListening(!listening);
    
    if (!listening) {
      // Dinlemeye başlıyoruz
      setTranscript("Dinleniyor...");
      // Burada gerçek ses kaydı ve işleme kodu yer alacak
      setTimeout(() => {
        setTranscript("Hangi otobüs saati hakkında bilgi almak istersiniz?");
      }, 2000);
    } else {
      // Dinleme durdu
      setTranscript("");
    }
  };

  const handleHelp = () => {
    // Yardım sayfasına yönlendir veya yardım modalı göster
    console.log("Yardım butonuna tıklandı");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Üst bilgi / Profil bilgisi */}
      {userData && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeUserText}>
            Merhaba, {userData.name} {userData.surname}
          </Text>
        </View>
      )}
      
      {/* Help Button - Sağ alttaki yardım butonu */}
      <View style={styles.helpButtonContainer}>
        <TouchableOpacity
          onPress={handleHelp}
          style={styles.helpButton}
          accessible={true}
          accessibilityLabel="Yardım butonu"
          accessibilityHint="Yardım için dokunun"
          accessibilityRole="button"
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {/* Otobüs Resmi */}
        <View style={styles.busImageContainer}>
          <Image
            source={{ uri: "https://img.freepik.com/free-vector/flat-design-public-transportation-background_23-2149023572.jpg" }}
            style={styles.busImage}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel="Otobüs resmi"
          />
        </View>

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
          <View style={styles.micIconContainer}>
            <Text style={styles.micIcon}>🎤</Text>
          </View>
        </TouchableOpacity>

        {/* Alt Bilgi */}
        <Text style={styles.infoText}>
          Otobüs saatleri için mikrofona dokunun ve sorunuzu sorun
        </Text>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  busImageContainer: {
    width: "100%",
    height: height * 0.25, // Ekranın %25'i kadar yükseklik
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  busImage: {
    width: "100%",
    height: "100%",
  },
  transcriptContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 30,
    minHeight: 100,
    justifyContent: "center",
  },
  transcriptText: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
  },
  micButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#007BFF", // İstenen mavi renk
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  micButtonActive: {
    backgroundColor: "#FF3B30", // Aktif durumdaki renk (kırmızı)
  },
  micIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: {
    fontSize: 50,
    color: "white",
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  helpButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 100, // En üstte görünmesi için
  },
  helpButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3b82f6", // Mavi yardım butonu
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  helpButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
}); 