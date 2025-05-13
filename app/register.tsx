import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  BackHandler,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "./context/auth";

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const { register } = useAuth();
  
  const [formData, setFormData] = React.useState({
    name: "",
    surname: "",
    phoneNumber: "",
  });
  const [isRegistering, setIsRegistering] = React.useState(false);

  // Kayıt olduktan sonra kullanıcının geri tuşu ile register/welcome sayfalarına dönmesini engelle
  React.useEffect(() => {
    const backHandler = () => {
      // Geri tuşuna basıldığında eğer kayıt sayfasındaysak ve kayıt yapma işlemi yoksa welcome sayfasına dön
      if (!isRegistering) {
        router.replace("/welcome");
        return true; // Geri tuşu işlemesini engelle
      }
      return false; // Geri tuşunun normal işlemesine izin ver
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => backSubscription.remove();
  }, [isRegistering]);

  // Telefon numarasını formatlama fonksiyonu (555 555 55 55 formatı)
  const formatPhoneNumber = (text: string): string => {
    // Sadece rakamları al
    const cleaned = text.replace(/\D/g, '');
    
    // Doğru formatta ayırma
    let formatted = '';
    if (cleaned.length <= 3) {
      formatted = cleaned;
    } else if (cleaned.length <= 6) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 8) {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else {
      formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    }
    
    return formatted;
  };

  // Telefon numarası değiştiğinde çağrılacak işleyici
  const handlePhoneNumberChange = (text: string): void => {
    const formattedNumber = formatPhoneNumber(text);
    setFormData({ ...formData, phoneNumber: formattedNumber });
  };

  const handleRegister = async () => {
    // Basit validasyon
    if (!formData.name || !formData.surname || !formData.phoneNumber) {
      return Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
    }

    try {
      setIsRegistering(true);
      
      // Kayıt işleminden önce telefon numarasındaki boşlukları temizle
      const cleanedPhoneNumber = formData.phoneNumber.replace(/\s/g, '');
      const cleanedFormData = {
        ...formData,
        phoneNumber: cleanedPhoneNumber
      };
      
      // AuthContext'teki register fonksiyonunu kullan
      await register(cleanedFormData);
      
    } catch (error) {
      console.error('Kayıt sırasında hata oluştu:', error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Image
        source={require('../assets/images/user-add.png')}
        style={styles.userIcon}
        resizeMode="contain"
        accessible={true}
        accessibilityLabel="Kullanıcı ekle ikonu"
      />
      
      <View style={styles.form}>
        <Text style={styles.label}>AD</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Adınızı girin"
          placeholderTextColor="#fff"
          accessible={true}
          accessibilityLabel="Ad"
        />
        
        <Text style={styles.label}>SOYAD</Text>
        <TextInput
          style={styles.input}
          value={formData.surname}
          onChangeText={(text) => setFormData({ ...formData, surname: text })}
          placeholder="Soyadınızı girin"
          placeholderTextColor="#fff"
          accessible={true}
          accessibilityLabel="Soyad"
        />
        
        <Text style={styles.label}>NUMARA</Text>
        <TextInput
          style={styles.input}
          value={formData.phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="555 555 55 55"
          placeholderTextColor="#fff"
          keyboardType="phone-pad"
          maxLength={14} // "555 555 55 55" formatı için maksimum 14 karakter
          accessible={true}
          accessibilityLabel="Telefon Numarası"
        />
      </View>
      
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister}
        disabled={isRegistering}
        accessible={true} 
        accessibilityLabel="Kayıt Ol Butonu"
      >
        {isRegistering ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <Text style={styles.registerText}>KAYIT OL</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  userIcon: {
    width: 120,
    height: 120,
    marginTop: 40,
    marginBottom: 24,
  },
  form: {
    width: width * 0.85,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    marginLeft: 8,
  },
  input: {
    backgroundColor: "#0084FF",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: "#FFC107",
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 5,
  },
  registerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
  },
}); 