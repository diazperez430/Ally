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
import awsconfig from './src/aws-exports.js';

try {
  console.log('Attempting to configure Amplify...');
  console.log('AWS config loaded successfully');
  Amplify.configure(awsconfig);
  console.log('Amplify configured successfully');
} catch (error: any) {
  console.error('Error configuring Amplify:', error);
  console.error('Error details:', error.message);
}

import React from 'react';
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);