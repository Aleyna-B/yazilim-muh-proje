import * as React from 'react';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AuthProvider, useAuth } from './context/auth';

// Kimlik doğrulama gerektirmeyen sayfalar
const publicRoutes = ['/welcome', '/register', '/index'];

// Root layout wrapper with AuthProvider
export default function RootLayoutWrapper() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}

// Main layout component that uses the auth context
function RootLayout() {
  const { isLoading, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Kimlik doğrulama durumuna göre yönlendirme yap
  React.useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

    if (isAuthenticated && isPublicRoute) {
      // Giriş yapmış kullanıcı public route'a erişmeye çalışıyorsa ana sayfaya yönlendir
      router.replace('/home');
    } else if (!isAuthenticated && !isPublicRoute) {
      // Giriş yapmamış kullanıcı korumalı sayfaya erişmeye çalışıyorsa welcome'a yönlendir
      router.replace('/welcome');
    }
  }, [isAuthenticated, pathname, isLoading]);

  // Yardım butonunu göster
  const handleHelp = () => {
    Alert.alert(
      "Yardım",
      "Yardım almak için lütfen destek hattını arayın.",
      [
        { text: "Tamam", style: "default" }
      ]
    );
  };

  const handleClearUserData = async () => {
    Alert.alert(
      "Oturumu Sonlandır",
      "Oturumu sonlandırmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        { 
          text: "Evet", 
          onPress: logout
        }
      ]
    );
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Sayfaların yüklenmesi */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home" />
        <Stack.Screen name="menu" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="+not-found" />
      </Stack>
      
      {/* Ortak yardım butonu - tüm sayfalarda görünecek */}
      <View style={styles.helpButtonContainer}>
        <TouchableOpacity
          onPress={handleHelp}
          onLongPress={handleClearUserData}
          style={styles.helpButton}
          accessible={true}
          accessibilityLabel="Yardım butonu"
          accessibilityHint="Yardım için dokunun. Kullanıcı verilerini silmek için uzun basın."
          accessibilityRole="button"
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  helpButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    zIndex: 100,
  },
  helpButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
  },
  helpButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
