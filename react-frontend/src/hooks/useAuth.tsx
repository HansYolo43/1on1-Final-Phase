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
    localStorage.setItem("token", data.access); // Store token
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
      localStorage.setItem("token", data.access); // Store token
    }

    return data; // Return the data to use in the component
  };

  return { accessToken, login, signup, error };
};
