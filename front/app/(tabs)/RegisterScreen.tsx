import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();

  const handleRegister = () => {
    router.push('/(tabs)/RegisterFormScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOŞ GELDİNİZ!</Text>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} accessible accessibilityLabel="Kayıt Ol">
        <Text style={styles.registerText}>KAYIT OL</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.helpButton} accessible accessibilityLabel="Yardım">
        <Image
          source={require('../../assets/images/help.png')}
          style={styles.helpIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  registerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  helpButton: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpIcon: {
    width: 28,
    height: 28,
  },
}); 