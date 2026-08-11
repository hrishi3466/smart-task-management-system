import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { parseApiError } from '../../api/client';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterForm } from '../../components/auth/RegisterForm';

/**
 * Register Page Component
 */
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRegister = async (registerData) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await register(registerData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account 🚀"
      subtitle="Join Smart Task Flow to manage projects and tasks"
    >
      <RegisterForm
        onSubmit={handleRegister}
        isLoading={isLoading}
        serverError={errorMsg}
      />
    </AuthLayout>
  );
};
