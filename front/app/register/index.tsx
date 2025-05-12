import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
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
        // @ts-ignore - TypeScript router path türü hatası
        router.replace("/welcome");
        return true; // Geri tuşu işlemesini engelle
      }
      return false; // Geri tuşunun normal işlemesine izin ver
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => backSubscription.remove();
  }, [isRegistering]);

  const handleRegister = async () => {
    // Basit validasyon
    if (!formData.name || !formData.surname || !formData.phoneNumber) {
      return Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
    }

    try {
      setIsRegistering(true);
      
      // Kayıt bilgilerini AsyncStorage'a kaydet
      await AsyncStorage.setItem('userData', JSON.stringify(formData));
      
      console.log("Kayıt bilgileri:", formData);
      
      // Ana sayfaya yönlendir ve stack'i temizle (geri tuşuna basıldığında welcome/register'a dönülmemesi için)
      // @ts-ignore - TypeScript router path türü hatası
      router.replace("/home/index");
    } catch (error) {
      console.error('Kayıt sırasında hata oluştu:', error);
      Alert.alert('Hata', 'Kayıt sırasında bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleHelp = () => {
    // Yardım sayfasına yönlendir veya yardım modalı göster
    console.log("Yardım butonuna tıklandı");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
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
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView style={styles.flex}>
          <View style={styles.content}>
            {/* User Icon */}
            <View style={styles.userIconContainer}>
              <View style={styles.userIcon}>
                <Text style={styles.userIconText}>+</Text>
              </View>
            </View>

            <View style={styles.headerContainer}>
              <Text
                style={styles.headerText}
                accessible={true}
                accessibilityLabel="Kayıt Ol"
                accessibilityRole="header"
              >
                KAYIT OL
              </Text>
              <Text
                style={styles.subHeaderText}
                accessible={true}
                accessibilityLabel="EGO Cepte uygulamasına hoş geldiniz. Lütfen kayıt olun."
              >
                EGO Cepte uygulamasına hoş geldiniz. Lütfen kayıt olun.
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ad</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                  placeholder="Adınız"
                  accessible={true}
                  accessibilityLabel="Ad"
                  accessibilityHint="Adınızı girin"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Soyad</Text>
                <TextInput
                  style={styles.input}
                  value={formData.surname}
                  onChangeText={(text) =>
                    setFormData({ ...formData, surname: text })
                  }
                  placeholder="Soyadınız"
                  accessible={true}
                  accessibilityLabel="Soyad"
                  accessibilityHint="Soyadınızı girin"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Telefon Numarası</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phoneNumber: text })
                  }
                  placeholder="5XX XXX XX XX"
                  keyboardType="phone-pad"
                  accessible={true}
                  accessibilityLabel="Telefon Numarası"
                  accessibilityHint="Telefon numaranızı girin"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              style={[styles.registerButton, isRegistering && styles.registerButtonDisabled]}
              disabled={isRegistering}
              accessible={true}
              accessibilityLabel="Kayıt Ol Butonu"
              accessibilityHint="Kayıt olmak için dokunun"
              accessibilityRole="button"
            >
              {isRegistering ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.registerButtonText}>KAYIT OL</Text>
              )}
            </TouchableOpacity>
            
            {/* Yardım butonu için ek boşluk */}
            <View style={styles.spacer} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    position: "relative",
  },
  userIconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  userIconText: {
    fontSize: 40,
    color: "#9ca3af",
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333333",
    marginBottom: 16,
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666666",
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC107", // Sarı buton rengi
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50, // Yuvarlak buton
    elevation: 3, // Android için gölge
    shadowColor: "#000", // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  registerButtonDisabled: {
    backgroundColor: "#FFC10799", // Hafif transparan sarı
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "white", // Beyaz yazı
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
  spacer: {
    height: 70, // Yardım butonu için ek alan
  },
}); 