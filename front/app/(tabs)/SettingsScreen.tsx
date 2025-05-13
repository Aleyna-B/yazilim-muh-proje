import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
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
      <View style={styles.buttonsWrapper}>
        <SettingButton label="AYAR 1" />
        <SettingButton label="AYAR 2" />
        <SettingButton label="AYAR 3" />
        <SettingButton label="AYAR 4" />
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

function SettingButton({ label }: { label: string }) {
  return (
    <TouchableOpacity style={styles.settingButton}>
      <Text style={styles.settingButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsWrapper: {
    width: width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingButton: {
    width: '100%',
    backgroundColor: '#0084FF',
    borderRadius: 18,
    paddingVertical: 28,
    marginBottom: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 26,
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