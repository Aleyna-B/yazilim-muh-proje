import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function RegisterFormScreen() {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [numara, setNumara] = useState('');

  const handleRegister = () => {
    // Burada kayıt işlemi yapılabilir
    console.log('Kayıt:', { ad, soyad, numara });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/user-add.png')}
        style={styles.userIcon}
        resizeMode="contain"
        accessible accessibilityLabel="Kullanıcı ekle ikonu"
      />
      <View style={styles.form}>
        <Text style={styles.label}>AD</Text>
        <TextInput
          style={styles.input}
          value={ad}
          onChangeText={setAd}
          placeholder="Adınızı girin"
          placeholderTextColor="#fff"
          accessibilityLabel="Ad"
        />
        <Text style={styles.label}>SOYAD</Text>
        <TextInput
          style={styles.input}
          value={soyad}
          onChangeText={setSoyad}
          placeholder="Soyadınızı girin"
          placeholderTextColor="#fff"
          accessibilityLabel="Soyad"
        />
        <Text style={styles.label}>NUMARA</Text>
        <TextInput
          style={styles.input}
          value={numara}
          onChangeText={setNumara}
          placeholder="Numaranızı girin"
          placeholderTextColor="#fff"
          keyboardType="numeric"
          accessibilityLabel="Numara"
        />
      </View>
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
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#0084FF',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#FFC107',
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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