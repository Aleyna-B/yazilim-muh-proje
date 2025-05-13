import React from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Otobüs ve rota ikonu */}
      <Image
        source={require('../../assets/images/bus-route.png')}
        style={styles.busRoute}
        resizeMode="contain"
        accessible accessibilityLabel="Otobüs ve rota görseli"
      />
      {/* Mikrofon butonu */}
      <TouchableOpacity style={styles.micButton} accessible accessibilityLabel="Mikrofon ile konuşmak için dokunun">
        <Image
          source={require('../../assets/images/microphone.png')}
          style={styles.micIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 40,
    color: '#000',
    textAlign: 'center',
  },
  busRoute: {
    width: width * 0.7,
    height: height * 0.35,
    marginTop: 40,
  },
  micButton: {
    marginTop: 40,
    backgroundColor: '#0084FF',
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  micIcon: {
    width: 56,
    height: 56,
    tintColor: '#fff',
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
