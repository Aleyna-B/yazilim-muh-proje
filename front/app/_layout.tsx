import * as React from 'react';
import { useFonts } from 'expo-font';
import { Stack, usePathname, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isUserRegistered, setIsUserRegistered] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    checkUserRegistration();
  }, []);

  const checkUserRegistration = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      setIsUserRegistered(userData !== null);
    } catch (error) {
      console.error('Kullanıcı bilgileri kontrol edilirken hata oluştu:', error);
      setIsUserRegistered(false);
    }
  };

  if (!loaded || isUserRegistered === null) {
    // Async font loading only occurs in development.
    return null;
  }

  // Kayıtlı kullanıcı welcome veya register sayfasına erişmeye çalışırsa home'a yönlendir
  if (isUserRegistered && (pathname === '/welcome' || pathname === '/register')) {
    // @ts-ignore - TypeScript href türü uyumsuzluğu hatasını bastır
    return <Redirect href="/home/index" />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="register" />
        <Stack.Screen name="home/index" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
