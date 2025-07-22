import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import SignUp from './SignUp';

// Define type for route params
export type RootStackParamList = {
  Home: undefined;
  Profile: { name: string };
};

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth >= 768;
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
            fontSize: isTablet ? 24 : 18,
          },
          headerLargeTitle: isTablet,
          headerLargeTitleStyle: {
            fontSize: isTablet ? 32 : 24,
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false, // Hide the topbar only in HomeScreen
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={SignUp}
          options={{
            title: '', // Remove Sign Up from the topbar
            headerShown: true,
          }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}


