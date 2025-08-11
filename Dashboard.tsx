import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, StatusBar, SafeAreaView, ScrollView, Pressable, Modal, TouchableWithoutFeedback, Linking, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'aws-amplify/auth';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;

// Responsive scaling functions
const scale = (size: number): number => {
  const baseWidth = 375;
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};

const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export default function Dashboard() {
  console.log('Dashboard component rendered');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showLogout, setShowLogout] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  
  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);

  // URL Callback functionality - triggers when login is completed and user reaches Dashboard
  useEffect(() => {
    const handleUrlCallback = async () => {
      try {
        // Get the initial URL that launched the app (if any)
        const initialUrl = await Linking.getInitialURL();
        
        if (initialUrl) {
          console.log('Initial URL detected:', initialUrl);
          setCallbackUrl(initialUrl);
          
          // Parse URL parameters
          const url = new URL(initialUrl);
          const params = new URLSearchParams(url.search);
          
          // Check for authentication callback parameters
          const authToken = params.get('auth_token');
          const userId = params.get('user_id');
          const redirectUrl = params.get('redirect_url');
          
          if (authToken || userId) {
            console.log('Authentication callback detected');
            Alert.alert(
              'Login Successful',
              'You have been successfully authenticated and redirected to the dashboard.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Handle successful authentication callback
                    console.log('Authentication callback confirmed');
                  },
                },
              ]
            );
          }
          
          // If there's a redirect URL, you can handle it here
          if (redirectUrl) {
            console.log('Redirect URL detected:', redirectUrl);
            // You can navigate to another screen or handle the redirect
          }
        }
      } catch (error) {
        console.error('Error handling URL callback:', error);
      }
    };

    // Handle URL callback when component mounts (indicating successful login)
    handleUrlCallback();

    // Set up listener for URL changes while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('URL change detected:', event.url);
      setCallbackUrl(event.url);
      
      // Handle deep link or callback URL
      if (event.url) {
        Alert.alert(
          'URL Callback',
          `Received callback URL: ${event.url}`,
          [{ text: 'OK' }]
        );
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setShowLogout(true)}>
          <View style={{ marginRight: isTablet ? 24 : 12 }}>
            <Ionicons name="person-circle" size={isTablet ? 32 : 24} color="#fff" />
          </View>
        </Pressable>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    setShowLogout(false);
    try {
      await signOut();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to home even if logout fails
      navigation.navigate('Home');
    }
  };

  const handleTestCallback = () => {
    // Simulate a callback URL for testing
    const testUrl = 'ally://dashboard?auth_token=test123&user_id=user456&redirect_url=https://example.com';
    setCallbackUrl(testUrl);
    Alert.alert(
      'Test Callback',
      'Simulated URL callback triggered for testing purposes.',
      [{ text: 'OK' }]
    );
  };

  const handleCameraPermission = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to use photo authentication.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    try {
      // Generate a simple photo URI for display
      const photoUri = 'photo_captured';
      setPhoto(photoUri);
      setShowCamera(false);
      
      Alert.alert(
        'Photo Captured!',
        'Your photo has been captured successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const flipCamera = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  const clearPhoto = () => {
    setPhoto(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Dashboard content goes here */}
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome to your Ally dashboard</Text>
          <Text style={styles.debugText}>Dashboard is working!</Text>
          
          {/* Camera Section */}
          <View style={styles.cameraSection}>
            <Text style={styles.sectionTitle}>Camera Access</Text>
            <Text style={styles.sectionSubtitle}>Take photos and capture moments</Text>
            
            {!permission?.granted ? (
              <Pressable style={styles.cameraButton} onPress={handleCameraPermission}>
                <Ionicons name="camera" size={24} color="#fff" />
                <Text style={styles.cameraButtonText}>Grant Camera Permission</Text>
              </Pressable>
            ) : (
              <View style={styles.cameraControls}>
                <Pressable style={styles.cameraButton} onPress={handleCameraPermission}>
                  <Ionicons name="camera" size={24} color="#fff" />
                  <Text style={styles.cameraButtonText}>Open Camera</Text>
                </Pressable>
                
                {/* Simple Photo Display */}
                {photo && (
                  <View style={styles.photoContainer}>
                    <Image 
                      source={{ uri: 'https://via.placeholder.com/300x300/6426A9/FFFFFF?text=Photo+Captured' }} 
                      style={styles.capturedPhoto} 
                    />
                    <Pressable style={styles.clearPhotoButton} onPress={clearPhoto}>
                      <Ionicons name="trash" size={20} color="#fff" />
                      <Text style={styles.clearPhotoText}>Clear Photo</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
          
          {/* URL Callback Status */}
          {callbackUrl && (
            <View style={styles.callbackContainer}>
              <Text style={styles.callbackTitle}>URL Callback Detected</Text>
              <Text style={styles.callbackUrl}>{callbackUrl}</Text>
            </View>
          )}
          
          {/* Test Callback Button */}
          <Pressable style={styles.testButton} onPress={handleTestCallback}>
            <Text style={styles.testButtonText}>Test URL Callback</Text>
          </Pressable>
        </View>
      </ScrollView>
      
      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={closeCamera}
      >
        <View style={styles.cameraModal}>
          <CameraView style={styles.camera} facing={cameraType}>
            <View style={styles.cameraHeader}>
              <Pressable style={styles.closeButton} onPress={closeCamera}>
                <Ionicons name="close" size={30} color="#fff" />
              </Pressable>
              <Pressable style={styles.flipButton} onPress={flipCamera}>
                <Ionicons name="camera-reverse" size={30} color="#fff" />
              </Pressable>
            </View>
            
            <View style={styles.cameraFooter}>
              <Pressable 
                style={styles.captureButton} 
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>
            </View>
          </CameraView>
        </View>
      </Modal>



      
      <View style={styles.footbar}>
        <Text style={styles.footbarText}>© 2025 Ally</Text>
      </View>
      
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLogout(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.logoutBox}>
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Log out</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fae7f7',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: isTablet ? 60 : 20,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: isTablet ? 32 : 24,
    marginBottom: isTablet ? 32 : 24,
    fontSize: isTablet ? 90 : 56,
    fontWeight: 'bold',
    color: '#6426A9',
    lineHeight: isTablet ? 100 : 64,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: isTablet ? 20 : moderateScale(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: isTablet ? 48 : 32,
    lineHeight: isTablet ? 28 : moderateScale(22),
  },
  debugText: {
    fontSize: isTablet ? 16 : 14,
    color: '#6426A9',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  callbackContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: isTablet ? 20 : 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  callbackTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#6426A9',
    textAlign: 'center',
    marginBottom: 8,
  },
  callbackUrl: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  testButton: {
    backgroundColor: '#002a2d',
    borderRadius: 8,
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: isTablet ? 32 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#002a2d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 14,
    letterSpacing: 1,
  },
  footbar: {
    width: '100%',
    backgroundColor: '#6426A9',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footbarText: {
    color: '#fff',
    fontSize: isTablet ? 15 : 12,
    fontWeight: '500',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  logoutBox: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    marginTop: 60,
    marginRight: 20,
    padding: isTablet ? 24 : 16,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e0d6ef',
  },
  logoutButton: {
    backgroundColor: '#6426A9',
    borderRadius: 8,
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: isTablet ? 18 : 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 14,
    letterSpacing: 1,
  },
  cameraSection: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: isTablet ? 20 : 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    color: '#6426A9',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: isTablet ? 14 : 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraButton: {
    backgroundColor: '#002a2d',
    borderRadius: 8,
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: isTablet ? 32 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#002a2d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  cameraButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 14,
    letterSpacing: 1,
  },
  cameraControls: {
    alignItems: 'center',
    marginTop: 16,
  },
  photoContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  capturedPhoto: {
    width: isTablet ? 200 : 150,
    height: isTablet ? 200 : 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearPhotoButton: {
    backgroundColor: '#6426A9',
    borderRadius: 8,
    paddingVertical: isTablet ? 8 : 6,
    paddingHorizontal: isTablet ? 16 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  clearPhotoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 14 : 12,
    letterSpacing: 1,
  },







  cameraModal: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
  },
  flipButton: {
    padding: 10,
  },
  cameraFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 50 : 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#6426A9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6426A9',
  },
});
