//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// SETV HEALTHCARE TECHNOLOGIES PRIVATE LIMITED///////////////////////
////////////////////PREGNANCY TRACKER SOURCE CODE VERSION 2.0  (READY FOR DEVELOPMENT)
//CODE CLEANED LAST ON : 27-02-2025//
//CODE LENGTH OF FILE AUTHCONTEXT LINE 16 - LINE 96//
//NUMBER OF SANITY CHECKS DONE DURING DEVELOPMENT : 5 CHECKS//
// DATE OF DEVELOPMENT START OF AUTHCONTEXT.JSX 26/2/2025 - 27/2/2025
///////////////////////// BASIC INFORMATION ABOUT THE FILE //////////////////////////////////////////
// This React Context file manages authentication state across the Pregnancy Tracker application.
// It provides global access to login, logout, and session management for the user.
// The context handles token storage and retrieval from localStorage to maintain login persistence.

// Key Features:
/*
Persistent Authentication:

User login state is preserved across page reloads using localStorage.

Centralized Authentication Management:

Login, Logout, and Current User Information is provided to all components via Context.

Automatic Session Handling:

On app startup, the context checks localStorage for a valid token and user data.

Secure Token Management:

Token is stored in localStorage and removed on logout.

Dynamic Role Handling (if extended):

This file can be enhanced to manage roles and permissions in the future.
*/

// Key Libraries and Dependencies:
/*
React: Core framework for building the component.

React Context: To create and manage global auth state.

localStorage: For persistent storage of auth tokens and user data.
*/

//Data Flow:
/*
User logs in > Token & User stored in localStorage > AuthContext updates global state.

User logs out > Token & User removed from localStorage > AuthContext clears global state.

App initializes > AuthContext reads from localStorage > Auth state restored (if valid).
*/
//ENV OF FILE : FRONTEND
// LANGUAGES USED : REACT JS
//SECURITY CODE LEVEL : HIGH
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////// CODE STARTS HERE ////////////////////////////////////////////////



import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token and user in localStorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("loggedInuser");

    if (token && user) {
      setIsLoggedIn(true);
      setLoggedInUser(user);
    } else {
      setIsLoggedIn(false);
      setLoggedInUser(null);
    }
    setLoading(false); // Finish loading
  }, []);

  const login = (user, token, role = "user") => {
    localStorage.setItem("loggedInuser", user);
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    sessionStorage.setItem("loggedInuser", user);
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("userRole", role);
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  const logout = () => {
    localStorage.removeItem("loggedInuser");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("loggedInuser");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loggedInUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);