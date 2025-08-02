// localStorage polyfill for React Native
if (typeof global.localStorage === 'undefined') {
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

// Amplify configuration - must be at the top
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';

try {
  Amplify.configure(amplifyconfig);
  console.log('Amplify configured successfully');
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

import React from 'react';
import { registerRootComponent } from 'expo';
import App from './App';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_p1TptfjXe",
  client_id: "1au0a520bbs3nd0dl5s3v39fm6",
  redirect_uri: "https://http://localhost:8081/",
  response_type: "code",
  scope: "email openid phone",
};

// Wrap App with AuthProvider for React Native
const AppWithAuth: React.FC = () => {
  return React.createElement(AuthProvider, cognitoAuthConfig, React.createElement(App));
};

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWithAuth);