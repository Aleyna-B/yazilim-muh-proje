import * as React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  TextInput,
  SafeAreaView,
  StatusBar,
  BackHandler,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "./context/auth";
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const BUTTON_WIDTH = (width * 0.92 - 16) / 2;
const STATUSBAR_HEIGHT = Constants.statusBarHeight;

export default function FavoritesScreen() {
  const { user, isLoading } = useAuth();
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('DURAKLAR'); // 'DURAKLAR' veya 'HATLAR'

  // Hardware back button handling
  React.useEffect(() => {
    const backAction = () => {
      router.push('/menu');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  if (isLoading || !user) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <Text>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Status bar için ek padding */}
      <View style={styles.statusBarPadding} />
      
      {/* Üst bilgi / Profil bilgisi */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.welcomeUserText}>
          Merhaba, {user.name} {user.surname}
        </Text>
      </View>
      
      <View style={styles.topButtonsRow}>
        <TouchableOpacity 
          style={[
            styles.topButton, 
            activeTab === 'DURAKLAR' && styles.activeTopButton
          ]}
          onPress={() => setActiveTab('DURAKLAR')}
          accessible={true}
          accessibilityLabel="Duraklar sekmesi"
          accessibilityRole="tab"
        >
          <Text style={styles.topButtonText}>DURAKLAR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.topButton, 
            activeTab === 'HATLAR' && styles.activeTopButton
          ]}
          onPress={() => setActiveTab('HATLAR')}
          accessible={true}
          accessibilityLabel="Hatlar sekmesi"
          accessibilityRole="tab"
        >
          <Text style={styles.topButtonText}>HATLAR</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.favoritesBox}>
        <View style={styles.searchInputRow}>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Favori arayın..."
            placeholderTextColor="#222"
            accessible={true}
            accessibilityLabel="Favori ara"
          />
          {search.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearch('')} 
              style={styles.clearButton} 
              accessible={true}
              accessibilityLabel="Temizle"
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Burada favorilerin listesi gösterilecek */}
        <View style={styles.favoritesListContainer}>
          <Text style={styles.emptyStateText}>
            {activeTab === 'DURAKLAR' ? 
              'Henüz favori durak eklemediniz.' : 
              'Henüz favori hat eklemediniz.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  statusBarPadding: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: 'white',
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  welcomeUserText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  activeTopButton: {
    backgroundColor: '#0084FF',
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
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
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
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.07)",
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
  favoritesListContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 