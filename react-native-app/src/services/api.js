import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'; 

// ** LÓGICA DE URL **
const API_URL = Platform.OS === 'web' 
    ? 'http://localhost:3000' 
    : 'http://192.168.15.10:3000';

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    async (config) => { 
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (e) {
            console.error("Erro ao buscar token do AsyncStorage", e);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;