import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { parseApiError } from '../../api/client';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { LoginForm } from '../../components/auth/LoginForm';

/**
 * Login Page Component
 */
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (credentials) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back! 👋"
      subtitle="Sign in to continue to Smart Task Flow"
    >
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        serverError={errorMsg}
      />
    </AuthLayout>
  );
};
