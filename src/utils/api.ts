import { API } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'idToken';

const getAuthHeader = async () => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString() || '';
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiGet = async (
  apiName: string,
  path: string,
  options: any = {}
) => {
  const headers = await getAuthHeader();
  return API.get(apiName, path, {
    ...options,
    headers: { ...(options.headers || {}), ...headers }
  });
};

export const apiPost = async (
  apiName: string,
  path: string,
  options: any = {}
) => {
  const headers = await getAuthHeader();
  return API.post(apiName, path, {
    ...options,
    headers: { ...(options.headers || {}), ...headers }
  });
};

export const refreshToken = async () => {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();
  if (idToken) {
    await AsyncStorage.setItem(TOKEN_KEY, idToken);
  }
  return idToken;
};
