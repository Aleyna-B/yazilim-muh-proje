import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Dimensions,
} from "react-native";
import { router } from "expo-router";

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
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
    router.push("/register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Text 
        style={styles.title}
        accessible={true}
        accessibilityLabel="Hoş geldiniz"
        accessibilityRole="header"
      >
        HOŞ GELDİNİZ!
      </Text>
      
      <TouchableOpacity 
        style={styles.registerButton} 
        onPress={handleRegister}
        accessible={true} 
        accessibilityLabel="Kayıt Ol Butonu"
        accessibilityHint="Kayıt olma sayfasına gitmek için dokunun"
      >
        <Text style={styles.registerText}>KAYIT OL</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 60,
    color: '#000',
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#FFC107',
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    elevation: 5,
  },
  registerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 