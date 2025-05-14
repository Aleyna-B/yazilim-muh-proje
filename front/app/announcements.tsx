import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, BackHandler, Platform } from 'react-native';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function AnnouncementsScreen() {
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
      
      <Text style={styles.title}>DUYURULAR</Text>
      
      <View style={styles.announcementsBox}>
        <Announcement title="DUYURU 1:" />
        <Announcement title="DUYURU 2:" />
        <Announcement title="DUYURU 3:" />
        <Announcement title="DUYURU 4:" />
      </View>
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
    marginBottom: 10,
    marginTop: STATUSBAR_HEIGHT + 20,
    color: '#000',
    textAlign: 'center',
  },
  announcementsBox: {
    width: width * 0.92,
    backgroundColor: '#eaf4fd',
    borderRadius: 12,
    marginTop: 32,
    paddingVertical: 24,
    paddingHorizontal: 18,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    elevation: 3,
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
}); 