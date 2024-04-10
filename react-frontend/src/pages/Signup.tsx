import React, { useState } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth"; 

const SignUp: React.FC = () => {
    const [name] = useState('');
    const [email] = useState('');
    const [password] = useState('');
    // const [error, setErrorMessage] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        toast.promise(
            signup(name, email, password , password), // Assuming this returns a promise
            {
                loading: 'Creating account...',
                success: 'Account successfully created!',
                error: 'Failed to create account. Please check your details.',
            }
        ).then(() => {
            // Redirect or perform additional actions on success
            navigate('/signin');
        }).catch(error => {
            // Error handling if needed
            console.error('Sign up error:', error);
        });
    };


    return (
<div className="bg-white dark:bg-gray-900">
    <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3" style={{backgroundImage: "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)"}}>
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
                    <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">SIGN UP</h2>
                    
                    <p className="mt-3 text-gray-500 dark:text-gray-300">Create your account</p>
                </div>

                <div className="mt-8">
                    <form id="form" onSubmit={handleSubmit}>
                        <div>
                            <label  className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Full Name</label>
                            <input type="text" name="name" id="name" placeholder="Your Name" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                        </div>

                        <div className="mt-6">
                            <label  className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
                            <input type="email" name="email" id="email" placeholder="example@example.com" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                        </div>

                        <div className="mt-6">
                            <label  className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password</label>
                            <input type="password" name="password" id="password" placeholder="Your Password" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" required />
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                id="signUpButton"
                                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <p className="mt-6 text-sm text-center text-gray-400">Already have an account? <NavLink to="/"  className="text-blue-500 focus:outline-none focus:underline hover:underline">Sign in</NavLink>.</p>
                </div>
            </div>
        </div>
    </div>
</div>
    );
};

export default SignUp;