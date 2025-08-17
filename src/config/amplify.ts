import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';

// Configure Amplify
export const configureAmplify = () => {
  Amplify.configure(awsconfig);
};

// API Configuration
export const API_ENDPOINTS = {
  TODO_API: 'TodoAPI',
  USER_API: 'UserAPI',
  AUTH_API: 'AuthAPI'
};

// Environment configuration
export const ENV = {
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  apiVersion: 'v1'
};

// Default export
export default {
  configureAmplify,
  API_ENDPOINTS,
  ENV
};
