import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AnnouncementsScreen() {
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
      <View style={styles.announcementsBox}>
        <Announcement title="DUYURU 1:" />
        <Announcement title="DUYURU 2:" />
        <Announcement title="DUYURU 3:" />
        <Announcement title="DUYURU 4:" />
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

function Announcement({ title }: { title: string }) {
  return (
    <View style={styles.announcementItem}>
      <Text style={styles.announcementTitle}>{title}</Text>
      <Text style={styles.announcementDots}>.............................................</Text>
      <Text style={styles.announcementDots}>.............................................</Text>
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
  announcementsBox: {
    width: width * 0.92,
    backgroundColor: '#eaf4fd',
    borderRadius: 12,
    marginTop: 32,
    paddingVertical: 24,
    paddingHorizontal: 18,
  },
  announcementItem: {
    marginBottom: 28,
  },
  announcementTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 6,
  },
  announcementDots: {
    fontSize: 18,
    color: '#222',
    letterSpacing: 2,
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