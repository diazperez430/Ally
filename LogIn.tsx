import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Platform, StatusBar, SafeAreaView, Image, Animated, Pressable, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useNavigation } from '@react-navigation/native';

type LogInNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
const isSmallDevice = screenWidth < 375;

// Responsive scaling functions
const scale = (size: number): number => {
  const baseWidth = 375;
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};

const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

export default function LogIn() {
 const navigation = useNavigation<LogInNavigationProp>();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const loginButtonScaleAnim = useRef(new Animated.Value(1)).current;
  const allyScaleAnim = useRef(new Animated.Value(1)).current;

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginButtonHovered, setIsLoginButtonHovered] = useState(false);
  const [isCreateAccountButtonHovered, setIsCreateAccountButtonHovered] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.18,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleLoginButtonPressIn = () => {
    Animated.spring(loginButtonScaleAnim, {
      toValue: 1.12,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleLoginButtonPressOut = () => {
    Animated.spring(loginButtonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleAllyPressIn = () => {
    Animated.spring(allyScaleAnim, {
      toValue: 1.18,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleAllyPressOut = () => {
    Animated.spring(allyScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleLogin = () => {
    // Placeholder for login logic
    alert(`Email: ${email}\nPassword: ${password}`);
  };

 return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Pressable
            onPressIn={handleAllyPressIn}
            onPressOut={handleAllyPressOut}
            onHoverIn={handleAllyPressIn}
            onHoverOut={handleAllyPressOut}
            style={{ alignSelf: 'center' }}
          >
            <Animated.Text style={[styles.allyWordLarge, { transform: [{ scale: allyScaleAnim }] }]}>Ally</Animated.Text>
          </Pressable>
        </Text>
        <Text style={styles.subtitle}>Your Trusted Companion for safe travel</Text>

        {/* Login Section */}
        <View style={styles.loginSection}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            onPress={handleLogin}
            onHoverIn={() => setIsLoginButtonHovered(true)}
            onHoverOut={() => setIsLoginButtonHovered(false)}
            style={({ pressed }) => [styles.loginButton, pressed && { opacity: 0.9 }]}
          >
            <Text style={[
              styles.loginButtonText,
              isLoginButtonHovered && { color: '#cccccc' }
            ]}>Log In</Text>
          </Pressable>
          <Text style={styles.forgotPassword}>Forgotten password?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            onHoverIn={() => setIsCreateAccountButtonHovered(true)}
            onHoverOut={() => setIsCreateAccountButtonHovered(false)}
       onPress={() => navigation.navigate('Profile', { name: 'Laneway Student' })}
            style={({ pressed }) => [styles.customButton, pressed && { opacity: 0.9 }]}
          >
            <Text style={[
              styles.customButtonText,
              isCreateAccountButtonHovered && { color: '#cccccc' }
            ]}>Create new Account</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.footbar}>
        <Text style={styles.footbarText}>© 2025 Ally</Text>
   </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fae7f7',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isTablet ? 60 : 20,
    paddingVertical: 40,
  },
  compassContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isTablet ? 32 : 24, // more space below
    alignSelf: 'center',
  },
  compassCircle: {
    backgroundColor: '#6426A9',
    width: isTablet ? 120 : 80,
    height: isTablet ? 120 : 80,
    borderRadius: isTablet ? 60 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isTablet ? 16 : 12,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  compassIcon: {
    width: isTablet ? 60 : 40,
    height: isTablet ? 60 : 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: isTablet ? 32 : 24,
  },
  allyWordLarge: {
    fontSize: isTablet ? 90 : 56,
    fontWeight: 'bold',
    color: '#6426A9',
    lineHeight: isTablet ? 100 : 64,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: isTablet ? 20 : moderateScale(16),
    color: '#666',
    textAlign: 'center',
    marginBottom: isTablet ? 48 : 32,
    lineHeight: isTablet ? 28 : moderateScale(22),
  },
  loginSection: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: isTablet ? 24 : 16,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: isTablet ? 32 : 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: isTablet ? 12 : 10,
    paddingHorizontal: isTablet ? 18 : 12,
    fontSize: isTablet ? 15 : 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0d6ef',
    color: '#6426A9',
  },
  loginButton: {
    backgroundColor: '#6426A9',
    borderRadius: 8,
    paddingVertical: isTablet ? 14 : 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#6426A9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: isTablet ? 16 : 14,
    letterSpacing: 1,
  },
  forgotPassword: {
    color: '#6426A9',
    fontSize: isTablet ? 14 : 12,
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  customButton: {
    backgroundColor: '#002a2d',
    borderRadius: 8,
    paddingVertical: isTablet ? 14 : 12,
    paddingHorizontal: isTablet ? 32 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 280,
    alignSelf: 'center',
    shadowColor: '#002a2d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  customButtonText: {
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
}); 