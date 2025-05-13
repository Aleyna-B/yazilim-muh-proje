import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const BUTTON_SIZE = width * 0.42;

const MENU_ITEMS = [
  { key: 'duraklar', label: 'DURAKLAR', icon: require('../../assets/images/durak.png'), color: '#0084FF', route: '/(tabs)/BusStopsScreen' },
  { key: 'rota', label: 'ROTA', icon: require('../../assets/images/rota.png'), color: '#FFC107', route: '/(tabs)/RouteScreen' },
  { key: 'favoriler', label: 'FAVORİLER', icon: require('../../assets/images/heart.png'), color: '#FFC107', route: '/(tabs)/FavoritesScreen' },
  { key: 'duyurular', label: 'DUYURULAR', icon: require('../../assets/images/megaphone.png'), color: '#0084FF', route: '/(tabs)/AnnouncementsScreen' },
  { key: 'ayarlar', label: 'AYARLAR', icon: require('../../assets/images/settings.png'), color: '#0084FF', route: '/(tabs)/SettingsScreen' },
];

export default function MainMenuScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* İlk iki satır: 2x2 grid */}
        <View style={styles.row}>
          <MenuButton item={MENU_ITEMS[0]} onPress={MENU_ITEMS[0].route ? () => router.push(MENU_ITEMS[0].route) : undefined} />
          <MenuButton item={MENU_ITEMS[1]} onPress={MENU_ITEMS[1].route ? () => router.push(MENU_ITEMS[1].route) : undefined} />
        </View>
        <View style={styles.row}>
          <MenuButton item={MENU_ITEMS[2]} onPress={MENU_ITEMS[2].route ? () => router.push(MENU_ITEMS[2].route) : undefined} />
          <MenuButton item={MENU_ITEMS[3]} onPress={MENU_ITEMS[3].route ? () => router.push(MENU_ITEMS[3].route) : undefined} />
        </View>
        {/* Son satır: ortalanmış tek buton */}
        <View style={styles.row}>
          <View style={{ flex: 1 }} />
          <MenuButton item={MENU_ITEMS[4]} onPress={MENU_ITEMS[4].route ? () => router.push(MENU_ITEMS[4].route) : undefined} />
          <View style={{ flex: 1 }} />
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

function MenuButton({ item, onPress }: any) {
  return (
    <View style={styles.menuButtonContainer}>
      <TouchableOpacity
        style={[styles.menuButton, { backgroundColor: item.color }]}
        {...(onPress ? { onPress } : {})}
      >
        <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={styles.menuLabel}>{item.label}</Text>
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
  grid: {
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  menuButtonContainer: {
    alignItems: 'center',
    marginHorizontal: 16,
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
    fontSize: 18,
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
}); 