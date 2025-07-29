import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';


// Define type for route params
export type RootStackParamList = {
  Home: undefined;
  Profile: { name: string };
  Dashboard: undefined;
};

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
// Responsive scaling function
const scale = (size: number): number => {
  const baseWidth = 375;
  const scaleFactor = screenWidth / baseWidth;
  return Math.round(size * scaleFactor);
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6426A9',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: scale(18),
          },
          headerShown: true,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            title: '',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Dashboard')}
                style={{
                  marginRight: isTablet ? 24 : 16,
                  padding: isTablet ? scale(8) : 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  minWidth: 44,
                  minHeight: 44,
                }}
              >
                <Ionicons
                  name="home"
                  size={isTablet ? 32 : 28}
                  color="#fff"
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Profile" 
          component={SignUp}
          options={{
            title: '', // Remove Sign Up from the topbar
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: '',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}


