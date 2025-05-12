import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      setIsRegistered(userData !== null);
      setIsLoading(false);
    } catch (error) {
      console.error('Kullanıcı bilgileri kontrol edilirken hata oluştu:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }

  // Kayıtlı kullanıcılar için geri tuşu ile welcome'a dönülmemesi için replace kullanıyoruz
  if (isRegistered) {
    // @ts-ignore - TypeScript href türü uyumsuzluğu hatasını bastır
    return <Redirect href="/home/index" />;
  } else {
    // @ts-ignore - TypeScript href türü uyumsuzluğu hatasını bastır
    return <Redirect href="/welcome" />;
  }
}
