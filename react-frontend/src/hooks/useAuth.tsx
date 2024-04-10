import { useState } from "react";

interface AuthState {
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  forgot_pass: (email: string) => Promise<void>;
  error: string | null;
}

export const useAuth = (): AuthState => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const response = await fetch("http://127.0.0.1:8000/user/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to login. Please check your username and password."
      );
    }

    setAccessToken(data.access);
    localStorage.setItem("token", data.access);// Store token
    //store refresh token
    localStorage.setItem("refresh", data.refresh);
    return data; // Return the data to potentially use it in the component
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    const response = await fetch("http://127.0.0.1:8000/user/new/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create an account. Please try again."
      );
    }

    if (data.access) {
      setAccessToken(data.access);
      localStorage.setItem("token", data.access);// Store token
      localStorage.setItem("refresh", data.refresh);
      //store refresh token
    }

    return data; // Return the data to use in the component
  };
const forgot_pass = async (email: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/user/forgot-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password. Please try again.');
      }
  
      // Assuming the API returns a success message or status, but you can adjust based on your API
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error; // Rethrow the error to be handled by the caller
      } else {
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return { accessToken, login, signup, forgot_pass, error  };
};
