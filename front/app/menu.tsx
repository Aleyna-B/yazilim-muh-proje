import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { router } from "expo-router";
import * as React from "react";
import {
    Alert,
    BackHandler,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "./context/auth";
import { useLocation } from "./context/location";

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.42;
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

// Şimdilik bu sayfalar oluşturulmadığı için /home'a yönlendirelim
// Gerçek route'lar oluşturuldukça güncellenecek
const MENU_ITEMS = [
  { key: 'duraklar', label: 'OTOBÜS NEREDE', icon: require('../assets/images/durak.png'), color: '#0084FF'},
  { key: 'rota', label: 'ROTA', icon: require('../assets/images/rota.png'), color: '#FFC107'},
  { key: 'favoriler', label: 'FAVORİLER', icon: require('../assets/images/heart.png'), color: '#FFC107'},
  { key: 'duyurular', label: 'DUYURULAR', icon: require('../assets/images/megaphone.png'), color: '#0084FF'},
  { key: 'ayarlar', label: 'AYARLAR', icon: require('../assets/images/settings.png'), color: '#0084FF'},
];

export default function MenuScreen() {
  const { user, isLoading } = useAuth();
  const { 
    updateLocation, 
    updateAddress, 
    updateError, 
    setLoading: setLocationLoading 
  } = useLocation();
  
  // Geri tuşuna basıldığında home sayfasına dön
  React.useEffect(() => {
    const backAction = () => {
      // Menu sayfasındayken geri tuşuna basılırsa home sayfasına dön
      router.replace('/home');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Konum bilgisini al - route.tsx'den taşındı
  React.useEffect(() => {
    (async () => {
      setLocationLoading(true);
      
      // Konum izni iste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        updateError('Konum izni reddedildi');
        Alert.alert(
          "Konum İzni Gerekli",
          "Uygulama özelliklerini kullanabilmek için konum izni gereklidir. Lütfen uygulama ayarlarından konum iznini etkinleştirin.",
          [{ text: "Tamam", style: "default" }]
        );
        setLocationLoading(false);
        return;
      }

      try {
        // Konum bilgisini al
        const locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        // Context'e kaydet
        updateLocation(locationResult);

        // Adres bilgisini al
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: locationResult.coords.latitude,
          longitude: locationResult.coords.longitude,
        });

        if (addressResponse && addressResponse.length > 0) {
          const addressData = addressResponse[0];
          const formattedAddress = `${addressData.street || ''} ${addressData.name || ''} ${addressData.district || ''} ${addressData.city || ''}`.trim();
          
          // Context'e kaydet
          updateAddress(formattedAddress);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
        updateError(`Konum alınamadı: ${errorMessage}`);
        Alert.alert(
          "Konum Hatası",
          "Konum bilgisi alınamadı. Lütfen daha sonra tekrar deneyin.",
          [{ text: "Tamam", style: "default" }]
        );
      } finally {
        setLocationLoading(false);
      }
    })();
  }, []);

  // Menü elemanına tıklandığında çağrılacak işleyici
  const handleMenuPress = (key: string) => {
    // Duraklar sayfası için özel yönlendirme ekle
    if (key === 'duraklar') {
      router.push('/busstops');
      return;
    }
    
    // Rota sayfası için özel yönlendirme ekle
    if (key === 'rota') {
      router.push('/route');
      return;
    }
    
    // Favoriler sayfası için özel yönlendirme ekle
    if (key === 'favoriler') {
      router.push('/favorites');
      return;
    }
    
    // Duyurular sayfası için özel yönlendirme ekle
    if (key === 'duyurular') {
      router.push('/announcements');
      return;
    }
    
    // Ayarlar sayfası için özel yönlendirme ekle
    if (key === 'ayarlar') {
      router.push('/settings');
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
      
      {/* Status bar için ek padding */}
      <View style={styles.statusBarPadding} />
      
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
  statusBarPadding: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: 'white',
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