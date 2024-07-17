// src/routes/AuthGuard.jsx
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useGlobalState } from '../provider/GlobalStateProvider';
import Signup_Login_Form from '../pages/Signup_Login_Form/Signup_Login_Form';

const AuthGuard = ({ element, adminOnly, ...rest }) => {
  const { accessToken, userRole } = useGlobalState();

  if (!accessToken) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/" />;
  }

  if (adminOnly && userRole !== 'Admin') {
    // Redirect if user is not an admin and adminOnly is true
    return <Navigate to="/" />;
  }

  return <Route {...rest} element={element} />;
};

export default AuthGuard;
