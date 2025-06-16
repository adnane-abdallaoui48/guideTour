import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const fetchPlaces = () => axios.get(`${BASE_URL}/places`);

export const fetchFavorites = async () =>
  axios.get(`${BASE_URL}/favorites`, await getAuthHeaders());

export const addFavorite = async (placeId) =>
  axios.post(`${BASE_URL}/favorites/${placeId}`, {}, await getAuthHeaders());

export const removeFavorite = async (placeId) =>
  axios.delete(`${BASE_URL}/favorites/${placeId}`, await getAuthHeaders());

export const getAvisByLieu = async (lieuId) =>
  axios.get(`${BASE_URL}/avis/place/${lieuId}`, await getAuthHeaders());

export const postAvis = async (lieuId, content) =>
  axios.post(`${BASE_URL}/avis/${lieuId}`, { content }, await getAuthHeaders());

export const postRating = async (placeId, value) =>
  axios.post(`${BASE_URL}/ratings/${placeId}`, { value }, await getAuthHeaders());

export const getAverageRatingByPlace = async (placeId) =>
  axios.get(`${BASE_URL}/ratings/place/${placeId}/average`, await getAuthHeaders());

export const getRatingByUserAndPlace = async (placeId) =>
  axios.get(`${BASE_URL}/ratings/place/${placeId}/user`, await getAuthHeaders())

export const getAllEvents = async () => axios.get(`${BASE_URL}/events`, await getAuthHeaders());

export const clearFavorites = async () =>
  axios.delete(`${BASE_URL}/favorites/clear`, await getAuthHeaders());

export const signIn = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/users/login`, {
    username,
    password,
  });
  return response.data;
}

export const signUp = async (userData) => {
  const response = await axios.post(`${BASE_URL}/users/register`, userData);
  return response.data;
}

export const signInWithGoogleBackend = async (idToken) => {
  const response = await axios.post(`${BASE_URL}/auth/google`, {
    token: idToken,
  });

  return response.data; 
};
