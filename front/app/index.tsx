import React from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from './context/auth';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Yükleme işlemi devam ediyorsa, yükleme göster
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFC107" />
      </View>
    );
  }
  
  // Kullanıcı oturum açmışsa home'a, açmamışsa welcome sayfasına yönlendir
  return <Redirect href={isAuthenticated ? "/home" : "/welcome"} />;
}
