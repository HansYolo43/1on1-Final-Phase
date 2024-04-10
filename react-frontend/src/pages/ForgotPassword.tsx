import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email] = useState("");

  // const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Replace with your actual password reset API endpoint
      const response = await fetch(
        "http://127.0.0.78000/user/forgot-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password. Please try again.");
      }

      toast.success(
        "If an account with that email exists, we have sent a password reset email."
      );
      //   navigate('/signin'); // Uncomment if you want to redirect
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">
                Welcome to 1on1 Calendar
              </h2>
              <p className="max-w-xl mt-3 text-gray-300">
                1on1 Calendar is your ultimate solution for scheduling and
                organizing meetings. Designed with simplicity and efficiency in
                mind, our platform allows you to effortlessly create, manage,
                and track your one-on-one meetings.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">
                FORGET PASSWORD
              </h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Reset your password
              </p>
            </div>

            <div className="mt-8">
              <form id="form" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="example@example.com"
                    value={email}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    id="resetPasswordButton"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Reset Password
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                Remembered your password?{" "}
                <NavLink
                  to="/"
                  className="text-blue-500 focus:outline-none focus:underline hover:underline"
                >
                  Sign in
                </NavLink>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
