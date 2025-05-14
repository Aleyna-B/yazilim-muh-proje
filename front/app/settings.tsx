import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, BackHandler, Platform } from 'react-native';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function SettingsScreen() {
  const router = useRouter();
  
  // Hardware back button handling
  useEffect(() => {
    const backAction = () => {
      router.push('/menu');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [router]);
  
  return (
    <View style={styles.container}>
      {/* Status bar için ek padding */}
      <View style={styles.statusBarPadding} />
      
      <Text style={styles.title}>AYARLAR</Text>
      
      <View style={styles.buttonsWrapper}>
        <SettingButton label="AYAR 1" />
        <SettingButton label="AYAR 2" />
        <SettingButton label="AYAR 3" />
        <SettingButton label="AYAR 4" />
      </View>
    </View>
  );
}

function SettingButton({ label }: { label: string }) {
  return (
    <TouchableOpacity 
      style={styles.settingButton}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
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
  statusBarPadding: {
    height: STATUSBAR_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    top: STATUSBAR_HEIGHT + 20,
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
    elevation: 3,
  },
  settingButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 