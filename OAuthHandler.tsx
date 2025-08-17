import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OAuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OAuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

export default function OAuthHandler() {
  const navigation = useNavigation<OAuthNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<OAuthTokens | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleOAuthFlow();
  }, []);

  const handleOAuthFlow = async () => {
    try {
      console.log('Starting OAuth flow...');
      
      // Check if we have an authorization code in the URL
      const initialUrl = await Linking.getInitialURL();
      console.log('Initial URL:', initialUrl);

      if (initialUrl && initialUrl.includes('code=')) {
        // Extract authorization code from URL
        const url = new URL(initialUrl);
        const authCode = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        console.log('Authorization code found:', authCode);
        console.log('State parameter:', state);

        if (authCode) {
          // Exchange authorization code for tokens
          await exchangeCodeForTokens(authCode);
        } else {
          setError('No authorization code found in URL');
          setIsLoading(false);
        }
      } else {
        // No authorization code, check if user is already authenticated
        console.log('No authorization code found, checking current session...');
        await checkCurrentSession();
      }
    } catch (error) {
      console.error('OAuth flow error:', error);
      setError('Failed to complete OAuth flow');
      setIsLoading(false);
    }
  };

  const exchangeCodeForTokens = async (authCode: string) => {
    try {
      console.log('Exchanging authorization code for tokens...');
      
      // Use Amplify's built-in token exchange
      const session = await fetchAuthSession();
      
      if (session.tokens) {
        console.log('Tokens obtained successfully');
        
        const tokens: OAuthTokens = {
          accessToken: session.tokens.accessToken.toString(),
          idToken: session.tokens.idToken?.toString() || '',
          refreshToken: '', // Amplify v6 doesn't expose refreshToken directly
          expiresIn: Date.now() + (60 * 60 * 1000), // 1 hour from now
        };

        setTokens(tokens);
        
        // Store tokens securely (you can use SecureStore or AsyncStorage)
        await storeTokens(tokens);
        
        // Navigate to Dashboard
        console.log('Navigating to Dashboard after successful OAuth flow');
        navigation.navigate('Dashboard');
      } else {
        setError('Failed to obtain tokens from authorization code');
      }
    } catch (error) {
      console.error('Token exchange error:', error);
      setError('Failed to exchange authorization code for tokens');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCurrentSession = async () => {
    try {
      console.log('Checking current authentication session...');
      
      const session = await fetchAuthSession();
      
      if (session.tokens) {
        console.log('User is already authenticated');
        
        const tokens: OAuthTokens = {
          accessToken: session.tokens.accessToken.toString(),
          idToken: session.tokens.idToken?.toString() || '',
          refreshToken: '', // Amplify v6 doesn't expose refreshToken directly
          expiresIn: Date.now() + (60 * 60 * 1000), // 1 hour from now
        };

        setTokens(tokens);
        navigation.navigate('Dashboard');
      } else {
        console.log('No active session found');
        // Redirect to login or show login form
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Session check error:', error);
      navigation.navigate('Home');
    } finally {
      setIsLoading(false);
    }
  };

  const storeTokens = async (tokens: OAuthTokens) => {
    try {
      await AsyncStorage.setItem('accessToken', tokens.accessToken);
      await AsyncStorage.setItem('idToken', tokens.idToken);
      console.log('Tokens stored');
    } catch (error) {
      console.error('Token storage error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setTokens(null);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Processing authentication...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.retryText} onPress={handleOAuthFlow}>
          Retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OAuth Handler</Text>
      {tokens && (
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenText}>
            Access Token: {tokens.accessToken.substring(0, 20)}...
          </Text>
          <Text style={styles.tokenText}>
            ID Token: {tokens.idToken.substring(0, 20)}...
          </Text>
          <Text style={styles.tokenText}>
            Expires: {new Date(tokens.expiresIn).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fae7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6426A9',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#6426A9',
    textDecorationLine: 'underline',
  },
  tokenInfo: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e0d6ef',
  },
  tokenText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
}); 