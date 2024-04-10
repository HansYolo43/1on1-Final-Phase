
// SignIn.tsx
import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        toast.promise(
            login(email, password), 
            {
                loading: 'Signing in...',
                success: 'Successfully signed in!', 
                error: 'Failed to sign in. Please check your credentials.',
            }
        ).then(() => {
            // Assuming login sets some auth state, check here
            if (localStorage.getItem('token')) navigate('/dashboard');
            // Else, the error toast will already have been shown
        }).catch(error => {
            // Error handling if needed
            console.error('Sign in error:', error);
        });
    };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1616763355603-9755a640a287)'}}>
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">Welcome to 1on1 Calendar</h2>
              <p className="max-w-xl mt-3 text-gray-300">1on1 Calendar is your ultimate solution for scheduling and organizing meetings. Designed with simplicity and efficiency in mind, our platform allows you to effortlessly create, manage, and track your one-on-one meetings.</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">SIGN IN</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
                  <input type="username" name="email" id="email"  placeholder="username"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Password</label>
                    <NavLink to="/forgot-password" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">Forgot password?</NavLink>
                  </div>

                  <input type="password" name="password" id="password" placeholder="Your Password"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <button type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                    Sign In
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet? <NavLink to="/Signup" className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign up</NavLink>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;