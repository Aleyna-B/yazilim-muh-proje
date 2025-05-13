import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
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
      <View style={styles.topButtonsRow}>
        <TouchableOpacity style={styles.topButton}>
          <Text style={styles.topButtonText}>DURAKLAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topButton}>
          <Text style={styles.topButtonText}>HATLAR</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.favoritesBox}>
        <View style={styles.searchInputRow}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Value"
            placeholderTextColor="#222"
            accessibilityLabel="Favori ara"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton} accessibilityLabel="Temizle">
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
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

const BUTTON_WIDTH = (width * 0.92 - 16) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 18,
    width: width * 0.92,
  },
  topButton: {
    backgroundColor: '#FFC107',
    borderRadius: 12,
    width: BUTTON_WIDTH,
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#222',
  },
  topButtonText: {
    color: '#222',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  favoritesBox: {
    width: width * 0.92,
    height: width * 1.05,
    backgroundColor: '#FFFDE7',
    borderRadius: 16,
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