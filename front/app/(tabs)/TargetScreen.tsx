import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TargetScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity
        style={styles.backButtonBottomLeft}
        onPress={() => router.replace('/(tabs)/RouteScreen')}
        accessible
        accessibilityLabel="Geri"
      >
        <Text style={styles.backButtonText}>← Geri</Text>
      </TouchableOpacity>
      <Text style={styles.title}>HEDEFİNİZ</Text>
      <View style={styles.box}>
        <Text style={styles.boxText}>
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{"\n"}
          aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{"\n"}
          aaaaaaaaaaaaaaaaaaaaaaa
        </Text>
      </View>
      <Text style={styles.infoText}>(TABİKİ SESLİ SÖYLÜYOR AMA{"\n"}YAZILI DA OLUYOR)</Text>
      <Text style={styles.subtitle}>NASIL GİDİLİR?</Text>
      <View style={styles.box} />
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
    marginBottom: 18,
    color: '#000',
    textAlign: 'center',
  },
  box: {
    width: width * 0.88,
    minHeight: 80,
    backgroundColor: '#FFFDE7',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    padding: 16,
  },
  boxText: {
    fontSize: 16,
    color: '#222',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#111',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 18,
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