import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { router } from "expo-router";

export default function HomeScreen() {
  // Welcome sayfasından geri tuşuna basıldığında uygulamadan çıkılsın
  React.useEffect(() => {
    const backAction = () => {
      // Welcome sayfasındayken geri tuşuna basılırsa uygulamadan çık
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const handleRegister = () => {
    // @ts-ignore - TypeScript router path türü hatası
    router.push("/register");
  };

  const handleHelp = () => {
    // Yardım sayfasına yönlendir veya yardım modalı göster
    console.log("Yardım butonuna tıklandı");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.content}>
        {/* Welcome Text - Büyük Hoş Geldiniz yazısı */}
        <View style={styles.welcomeContainer}>
          <Text
            style={styles.welcomeText}
            accessible={true}
            accessibilityLabel="Hoş geldiniz"
            accessibilityRole="header"
          >
            HOŞ GELDİNİZ!
          </Text>
        </View>

        {/* Register Button - Sarı Kayıt Ol butonu */}
        <TouchableOpacity
          onPress={handleRegister}
          style={styles.registerButton}
          accessible={true}
          accessibilityLabel="Kayıt ol butonu"
          accessibilityHint="Kayıt olma sayfasına gitmek için dokunun"
          accessibilityRole="button"
        >
          <Text style={styles.registerButtonText}>KAYIT OL</Text>
        </TouchableOpacity>

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

        {/* Home Indicator for iOS */}
        {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    position: "relative",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
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
  registerButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white", // Kayıt Ol yazısı beyaz
  },
  helpButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 30,
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
  homeIndicator: {
    height: 4,
    width: 80,
    backgroundColor: "#d1d5db",
    borderRadius: 999,
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
  },
});
