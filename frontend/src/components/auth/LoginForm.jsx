import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

/**
 * Login Form Component matching Global Design System
 */
export const LoginForm = ({ onSubmit, isLoading, serverError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
      {serverError && (
        <div
          role="alert"
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-danger-bg)',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            fontSize: '13px',
            marginBottom: 'var(--space-4)',
          }}
        >
          {serverError}
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        error={fieldErrors.email}
        icon={Mail}
        required
        disabled={isLoading}
        autoComplete="email"
      />

      {/* Password Input with Forgot Password Action */}
      <Input
        label="Password"
        labelAction={
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-primary)',
              cursor: 'pointer',
            }}
          >
            Forgot password?
          </span>
        }
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        error={fieldErrors.password}
        icon={Lock}
        required
        disabled={isLoading}
        autoComplete="current-password"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        style={{
          width: '100%',
          marginTop: 'var(--space-4)',
          height: 44,
          fontSize: '14px',
          fontWeight: 600,
          borderRadius: 'var(--radius-md)',
        }}
      >
        Sign in
      </Button>

      {/* Social Login Divider */}
      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      {/* Social Auth Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          className="auth-social-btn"
          onClick={() => {}}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          className="auth-social-btn"
          onClick={() => {}}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
            <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
            <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
            <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
          </svg>
          <span>Continue with Microsoft</span>
        </button>
      </div>

      {/* Sign Up Link Footer */}
      <div
        style={{
          marginTop: 'var(--space-6)',
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
        }}
      >
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          style={{
            fontWeight: 600,
            color: 'var(--color-primary)',
          }}
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};
