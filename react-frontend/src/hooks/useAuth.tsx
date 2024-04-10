import { useState } from 'react';
import toast from 'react-hot-toast';

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
      const response = await fetch('http://127.0.0.1:8000/user/token/', {
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
        if (error instanceof Error) {
            setError(error.message);
            toast.error(error.message);
        }

      else setError('An unexpected error occurred. Please try again later.');
    }
  };

  const signup = async (username: string, email: string, password: string, confirm_password: string) => {
    setError(null); // Reset error before a new signup attempt
      try {
          const response = await fetch('http://127.0.0.1:8000/user/new/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, email, password,confirm_password }),
          });
        
        console.log(response.body)

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

          // If the API doesn't return an access token directly upon signup,
          // you might want to navigate the user to the login page instead
      } catch (error) {
          if (error instanceof Error) {
              setError(error.message);
              toast.error(error.message);
      }
      else setError('An unexpected error occurred. Please try again later.');
    }
  };

  return { accessToken, login, signup, error };
};
