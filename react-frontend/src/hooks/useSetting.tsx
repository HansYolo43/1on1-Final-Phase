// useSettings.tsx
import { useState, useContext } from 'react';
import axios from 'axios';
// Adjust path as necessary

interface UserPayload {
  username?: string;
  email?: string;
  password?: string;
  confirm_password?: string;
}

interface SettingsState {
  user: any; 
  getUserInfo: () => Promise<void>;
  updateUserInfo: (payload: UserPayload) => Promise<void>;
  error: string | null;
}

const useSettings = () => {
  const [user, setUser] = useState(null); // Adjust this to the shape of your user data
  const [error, setError] = useState<string | null>(null);
  const  accessToken  = localStorage.getItem("token") // This assumes you store your access token in an AuthContext

const getUserInfo = async () => {
    try {
        const response = await axios.get('http://127.0.0.1:8000/user/user/', {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
            },
        });
        setUser(response.data);

        return response.data;
    } catch (error: any) {
        setError(error.response?.data?.message || 'Could not fetch user data.');
    }
};

const updateUserInfo = async (payload: UserPayload) => {
    try {
        const response = await axios.put('http://127.0.0.1:8000/user/user/', payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Use the access token for authorization
            },
        });
        setUser(response.data); // Update the local user data with the response
    } catch (error: any) {
        setError(error.response?.data?.message || 'Could not update user data.');
    }
};

  return {
    user,
    getUserInfo,
    updateUserInfo,
    error,
  };
};

export default useSettings;
