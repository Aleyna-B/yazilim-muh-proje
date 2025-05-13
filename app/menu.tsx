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
  BackHandler,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "./context/auth";

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.42;

// Şimdilik bu sayfalar oluşturulmadığı için /home'a yönlendirelim
// Gerçek route'lar oluşturuldukça güncellenecek
const MENU_ITEMS = [
  { key: 'duraklar', label: 'DURAKLAR', icon: require('../assets/images/durak.png'), color: '#0084FF'},
  { key: 'rota', label: 'ROTA', icon: require('../assets/images/rota.png'), color: '#FFC107'},
  { key: 'favoriler', label: 'FAVORİLER', icon: require('../assets/images/heart.png'), color: '#FFC107'},
  { key: 'duyurular', label: 'DUYURULAR', icon: require('../assets/images/megaphone.png'), color: '#0084FF'},
  { key: 'ayarlar', label: 'AYARLAR', icon: require('../assets/images/settings.png'), color: '#0084FF'},
];

export default function MenuScreen() {
  const { user, isLoading } = useAuth();
  
  // Geri tuşuna basıldığında uygulamadan çıkılsın
  React.useEffect(() => {
    const backAction = () => {
      // Menu sayfasındayken geri tuşuna basılırsa uygulamadan çık
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Menü elemanına tıklandığında çağrılacak işleyici
  const handleMenuPress = (key: string) => {
    // Favoriler sayfası için özel yönlendirme ekle
    if (key === 'favoriler') {
      router.push('/favorites');
      return;
    }
    
    // Diğer sayfalar için henüz uygulanmadı bildirimi
    Alert.alert(`${key} sayfası henüz oluşturulmadı`, "Bu özellik yakında eklenecektir.");
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
      </View>
      
      <View style={styles.grid}>
        {/* İlk iki satır: 2x2 grid */}
        <View style={styles.row}>
          <MenuButton item={MENU_ITEMS[0]} onPress={() => handleMenuPress(MENU_ITEMS[0].key)} />
          <MenuButton item={MENU_ITEMS[1]} onPress={() => handleMenuPress(MENU_ITEMS[1].key)} />
        </View>
        <View style={styles.row}>
          <MenuButton item={MENU_ITEMS[2]} onPress={() => handleMenuPress(MENU_ITEMS[2].key)} />
          <MenuButton item={MENU_ITEMS[3]} onPress={() => handleMenuPress(MENU_ITEMS[3].key)} />
        </View>
        {/* Son satır: ortalanmış tek buton */}
        <View style={styles.row}>
          <View style={{ flex: 1 }} />
          <MenuButton item={MENU_ITEMS[4]} onPress={() => handleMenuPress(MENU_ITEMS[4].key)} />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface MenuButtonProps {
  item: {
    key: string;
    label: string;
    icon: any;
    color: string;
  };
  onPress: () => void;
}

function MenuButton({ item, onPress }: MenuButtonProps) {
  return (
    <View style={styles.menuButtonContainer}>
      <TouchableOpacity
        style={[styles.menuButton, { backgroundColor: item.color }]}
        onPress={onPress}
        accessible={true}
        accessibilityLabel={item.label}
        accessibilityRole="button"
      >
        <Image 
          source={item.icon} 
          style={styles.menuIcon} 
          resizeMode="contain"
          accessible={true}
          accessibilityLabel={`${item.label} ikonu`}
        />
      </TouchableOpacity>
      <Text 
        style={styles.menuLabel}
        accessible={true}
        accessibilityLabel={item.label}
      >
        {item.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
  grid: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  menuButtonContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 6,
  },
}); 