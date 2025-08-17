import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { fetchAuthSession, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TestAuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TestAuth() {
  const navigation = useNavigation<TestAuthNavigationProp>();
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check current session
      const session = await fetchAuthSession();
      setSessionInfo(session);
      
      // Check current user
      try {
        const user = await getCurrentUser();
        setUserInfo(user);
      } catch (error) {
        console.log('No current user found');
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setSessionInfo(null);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const testSignIn = async () => {
    try {
      setIsLoading(true);
      
      // Test with a known user (you'll need to create this user first)
      const { isSignedIn } = await signIn({
        username: 'test@example.com',
        password: 'TestPassword123!'
      });

      let tokenSnippet = 'N/A';
      if (isSignedIn) {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) {
          tokenSnippet = idToken.substring(0, 20) + '...';
          try {
            await AsyncStorage.setItem('idToken', idToken);
          } catch (err) {
            console.error('Error storing ID token:', err);
          }
        }
      }

      Alert.alert('Sign In Result', `isSignedIn: ${isSignedIn}\nToken: ${tokenSnippet}`);
      await checkAuthStatus();
    } catch (error: any) {
      Alert.alert('Sign In Error', error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      Alert.alert('Sign Out', 'Successfully signed out');
      await checkAuthStatus();
    } catch (error: any) {
      Alert.alert('Sign Out Error', error.message || 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testOAuthHandler = () => {
    navigation.navigate('OAuthHandler');
  };

  const testDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Authentication Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={checkAuthStatus}>
          <Text style={styles.buttonText}>Check Auth Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSignIn}>
          <Text style={styles.buttonText}>Test Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testSignOut}>
          <Text style={styles.buttonText}>Test Sign Out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testOAuthHandler}>
          <Text style={styles.buttonText}>Test OAuth Handler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testDashboard}>
          <Text style={styles.buttonText}>Test Dashboard</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <Text style={styles.loadingText}>Loading...</Text>
      )}

      {sessionInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Session Info:</Text>
          <Text style={styles.infoText}>
            Tokens: {sessionInfo.tokens ? 'Available' : 'Not available'}
          </Text>
          <Text style={styles.infoText}>
            Credentials: {sessionInfo.credentials ? 'Available' : 'Not available'}
          </Text>
          <Text style={styles.infoText}>
            Identity ID: {sessionInfo.identityId || 'None'}
          </Text>
        </View>
      )}

      {userInfo && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>User Info:</Text>
          <Text style={styles.infoText}>Username: {userInfo.username}</Text>
          <Text style={styles.infoText}>User ID: {userInfo.userId}</Text>
        </View>
      )}

      {!sessionInfo && !isLoading && (
        <Text style={styles.noDataText}>No session data available</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fae7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6426A9',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6426A9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  infoContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0d6ef',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6426A9',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 