import * as React from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import apiService from '../services/api';

// Kullanıcı tipi tanımı
interface UserData {
  _id?: string;
  name: string;
  surname: string;
  phoneNumber: string;
}

// Auth Context tipi
interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: UserData) => Promise<void>;
}

// Varsayılan değerler
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
};

// Context oluşturma
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Auth Provider bileşeni
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Uygulama başlangıcında kullanıcı durumunu kontrol et
  useEffect(() => {
    loadUserData();
  }, []);

  // AsyncStorage'dan kullanıcı verilerini yükle
  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString) as UserData;
        setUser(userData);
      }
    } catch (error) {
      console.error('Kullanıcı verileri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Kayıt işlemi
  const register = async (userData: UserData) => {
    try {
      setIsLoading(true);
      
      // API servisini kullanarak kayıt işlemi yap
      const response = await apiService.registerUser(
        userData.name,
        userData.surname,
        userData.phoneNumber
      );
      
      if (response && response.success && response.data) {
        // API'den dönen veriyi kullan
        const apiUser = response.data;
        
        // Kullanıcı verisini oluştur (_id API'den gelecek)
        const newUserData: UserData = {
          _id: apiUser._id,
          name: apiUser.name,
          surname: apiUser.surname,
          phoneNumber: apiUser.phone_number
        };
        
        // AsyncStorage'a kaydet
        await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
        setUser(newUserData);
        
        // Ana sayfaya yönlendir
        router.replace('/home');
        return; // Başarılı kayıt durumunda fonksiyondan çık
      } else {
        throw new Error(response.message || 'Kayıt işlemi başarısız oldu.');
      }
    } catch (error: unknown) {
      console.error('Kayıt sırasında hata:', error);
      
      // Hata mesajını göster
      const errorMessage = error instanceof Error ? error.message : 'Kayıt olurken bir sorun oluştu. Lütfen tekrar deneyin.';
      Alert.alert('Kayıt Hatası', errorMessage);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Giriş işlemi (ileride kullanılabilir)
  const login = async (userData: UserData) => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      
      // Ana sayfaya yönlendir
      router.replace('/home');
    } catch (error) {
      console.error('Giriş sırasında hata:', error);
      Alert.alert('Hata', 'Giriş yaparken bir sorun oluştu. Lütfen tekrar deneyin.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('userData');
      setUser(null);
      
      // Giriş sayfasına yönlendir
      router.replace('/welcome');
    } catch (error) {
      console.error('Çıkış sırasında hata:', error);
      Alert.alert('Hata', 'Çıkış yaparken bir sorun oluştu. Lütfen tekrar deneyin.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Context değerlerini hazırla
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook kullanımı için özel fonksiyon
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 