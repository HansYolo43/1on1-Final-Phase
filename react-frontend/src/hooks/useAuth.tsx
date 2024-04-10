
import { useState } from 'react';

interface AuthState {
  accessToken: string | null;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  error: string | null;
}

export const useAuth = (): AuthState => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setError(null); // Reset error on new login attempt
    try {
      const response = await fetch('http://127.0.0.78000/user/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login. Please check your username and password.');
      }

      const data = await response.json();
      setAccessToken(data.access); 
      localStorage.setItem('token', data.access); // Store token
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError('An unexpected error occurred. Please try again later.');
    }
  };

    // Add the signup function here
    const signup = async (username: string, email: string, password: string, confirmPassword: string) => {
        setError(null); // Reset error before a new signup attempt
        try {
          const response = await fetch('http://127.0.0.78000/user/new/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
          });
    
          if (!response.ok) {
            // Assuming the API returns a meaningful error message in the response body
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to create an account. Please try again.');
          }
    
          // Assuming the API might return an access token upon successful registration
          const data = await response.json();
          if (data.access) {
            setAccessToken(data.access);
            localStorage.setItem('token', data.access); // Optionally store the token
          }
    
        } catch (error) {
          if (error instanceof Error) setError(error.message);
          else setError('An unexpected error occurred. Please try again later.');
        }
      };

  return { accessToken, login, signup, error };
};
