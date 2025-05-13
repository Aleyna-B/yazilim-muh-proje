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
  BackHandler,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "./context/auth";

// Kullanıcı veri tipi tanımı artık context'ten geliyor

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");

  // Geri tuşuna basıldığında uygulamadan çıkılsın
  React.useEffect(() => {
    const backAction = () => {
      // Home sayfasındayken geri tuşuna basılırsa uygulamadan çık
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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

  const navigateToMenu = () => {
    router.push("/menu");
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