import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.48;

export default function RouteScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity
        style={styles.backButtonBottomLeft}
        onPress={() => router.replace('/(tabs)/MainMenuScreen')}
        accessible
        accessibilityLabel="Geri"
      >
        <Text style={styles.backButtonText}>← Geri</Text>
      </TouchableOpacity>
      <Text style={styles.title}>NASIL GİDERİM?</Text>
      <Text style={styles.subtitle}>ŞU ANDA BURADASIN:</Text>
      <View style={styles.centeredContent}>
        <TouchableOpacity style={styles.targetButton} onPress={() => router.push('/(tabs)/TargetScreen')}>
          <Image source={require('../../assets/images/microphone.png')} style={styles.targetIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>HEDEF</Text>
        <TouchableOpacity style={styles.favButton} onPress={() => router.push('/(tabs)/FavoritesScreen')}>
          <Image source={require('../../assets/images/heart.png')} style={styles.favIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.buttonLabel}>FAVORİLERİM</Text>
      </View>
      {/* Yardım butonu */}
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
    marginTop: 40,
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#222',
    marginBottom: 32,
    textAlign: 'center',
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  targetButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  favButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  favIcon: {
    width: BUTTON_SIZE * 0.45,
    height: BUTTON_SIZE * 0.45,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
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
  targetIcon: {
    width: BUTTON_SIZE * 0.45,
    height: BUTTON_SIZE * 0.45,
  },
  backButtonBottomLeft: {
    position: 'absolute',
    left: 24,
    bottom: 32,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    elevation: 2,
  },
  backButtonText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
}); 