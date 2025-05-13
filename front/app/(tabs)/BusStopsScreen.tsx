import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function BusStopsScreen() {
  const [search, setSearch] = useState('');
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
      {/* Arama kutusu ve kutu arka planı */}
      <View style={styles.searchBoxWrapper}>
        <View style={styles.searchInputRow}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Durak numarası girin"
            placeholderTextColor="#222"
            accessibilityLabel="Durak numarası girin"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton} accessibilityLabel="Temizle">
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {/* Alt butonlar */}
      <View style={styles.bottomButtonsRow}>
        <View style={styles.menuButtonContainer}>
          <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#0084FF' }]}> 
            <Image source={require('../../assets/images/bus.png')} style={styles.menuIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.menuLabel}>YAKINDAKİ{"\n"}DURAKLAR</Text>
        </View>
        <View style={styles.menuButtonContainer}>
          <TouchableOpacity style={[styles.menuButton, { backgroundColor: '#0084FF' }]}> 
            <Image source={require('../../assets/images/location.png')} style={styles.menuIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.menuLabel}>DURAK ARA</Text>
        </View>
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

const BUTTON_SIZE = width * 0.36;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  searchBoxWrapper: {
    width: width * 0.92,
    height: width * 1.05,
    backgroundColor: '#eaf4fd',
    borderRadius: 16,
    marginTop: 24,
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 32,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#222',
    backgroundColor: 'transparent',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearButtonText: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 32,
    marginBottom: 16,
  },
  menuButtonContainer: {
    alignItems: 'center',
    marginHorizontal: 18,
    flex: 1,
  },
  menuButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  menuIcon: {
    width: BUTTON_SIZE * 0.5,
    height: BUTTON_SIZE * 0.5,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 6,
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