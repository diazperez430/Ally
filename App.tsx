import React from 'react';
import { Dimensions, TouchableOpacity } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogIn from './LogIn';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import TodoScreen from './TodoScreen';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";

// Amplify imports
import { withAuthenticator } from '@aws-amplify/ui-react-native';

// Define type for route params
export type RootStackParamList = {
  Home: undefined;
  Profile: { name: string };
  Dashboard: undefined;
  DashboardScreen: undefined;
  TodoScreen: undefined;
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

function App() {
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
          component={LogIn}
          options={({ navigation }) => ({
            headerShown: true,
            title: '',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  console.log('Chevron arrow pressed, navigating to Dashboard');
                  navigation.navigate('Dashboard');
                }}
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
                  name="chevron-forward"
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
            title: '',
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
        <Stack.Screen
          name="DashboardScreen"
          component={Dashboard}
          options={{
            title: '',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="TodoScreen"
          component={TodoScreen}
          options={{
            title: 'Todo List',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default App;

