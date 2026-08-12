//////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED /////////////////////////////
//////////////////////// PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEVELOPMENT) /////////
// CODE CLEANED LAST ON : 27-02-2025
// CODE LENGTH OF FILE FORGOTPASSWORD.JSX LINE 16 - LINE 135
// NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS
// DATE OF DEVELOPMENT START OF FORGOTPASSWORD.JSX : 26/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React component handles the Forgot Password functionality for the Pregnancy Tracker application.
// It allows users to request a password reset link via their registered email address.
// The component integrates with the backend's `/auth/forgot-password` endpoint to trigger the email.

// Key Features:
/*
Password Reset Request Form:

Single input field to capture the user's registered email or username.

Backend Integration:

Form data is submitted to the backend API (`/auth/forgot-password`), triggering an email with reset link.

Real-time Notifications:

Success or error messages are shown using `react-hot-toast`.

Navigation:

On successful request, the user is automatically redirected to the Login page after a short delay.

Responsive Design:

The form is mobile-friendly and adapts to different screen sizes.

UI & Branding:

Uses customized colors, logo, and design elements aligned with the Pregnancy Tracker's branding.

Error Handling:

Comprehensive error handling for both validation and network errors.
*/

// Key Libraries and Dependencies:
/*
React: Core library for component structure.

React Hook Form: Efficient form handling and validation.

React Router DOM: For navigation after successful operation.

Tailwind CSS: Responsive styling.

ShadCN UI (Input and Label Components): Ensures consistent design across the app.

react-hot-toast: Provides user-friendly notifications.
*/

// Data Flow:
/*
User enters email > Form validates input > Request sent to backend > Backend responds > 
Success message shown + Redirect to Login OR Error message shown if something goes wrong.
*/
// ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS , TAILWIND CSS
// SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////




import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import logo from "../assets/logo_transparent_background.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const url = "http://localhost:8080/auth/forgot-password";  // Replace with your backend route for forgot password
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      const { success, error } = result;
      if (success) {
        toast.success("Password reset link sent to your email!");
        setTimeout(() => {
          navigate("/login"); // Redirect back to login after successful request
        }, 2000);
      } else if (error) {
        toast.error(error.message || "Something went wrong. Please try again.");
      } else {
        toast.error(result.message || "Error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during password reset request. Please try again.");
      console.error("Error in forgot password:", error);
    }
    setLoading(false);
    
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D6B3FF]">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-md p-8  bg-[#FFC1E3] rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src={logo}
            alt="Logo"
            className="mx-auto w-30 mb-5 h-20"
          />
          <h1 className="text-3xl font-bold mt-10 text-orange-600 ">Women Wellness</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 text-black space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Username/Email
            </Label>
            <Input
              type="text"
              id="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Forgot Password Instruction */}
          <div className="text-center text-sm text-gray-600">
            <p>
              We'll send a reset link to your email. Please check your inbox.
            </p>
          </div>

          {/* Request Reset Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-orange-600 rounded-md hover:bg-orange-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Remembered your password?{" "}
          <Link to="/login" className="text-orange-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
