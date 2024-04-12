import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const useToken = () => {
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));


    const obtainToken = async (username: string, password: string) => {
        try {
          const response = await axios.post(`${API_URL}/user/token/`, {
            username,
            password,
          });
          const { access, refresh } = response.data;
          localStorage.setItem('accessToken', access);
          localStorage.setItem('refreshToken', refresh);
          setAccessToken(access);
          setRefreshToken(refresh);
        } catch (error) {
          console.error('Error obtaining token:', error);
          throw error;
        }
      };
    
    const refreshTokenFunc = async () => {
        try {
            const response = await fetch(`${API_URL}/user/token/refresh/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh: refreshToken }),
            });
            const data = await response.json();
          
            const { access, refresh } = data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            setAccessToken(access);
            setRefreshToken(refresh);
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    };

    return { obtainToken, refreshToken: refreshTokenFunc, accessToken };
};