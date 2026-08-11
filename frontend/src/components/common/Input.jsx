import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable Form Input Component with label, icon prefix, password toggle, and error state
 */
export const Input = ({
  label,
  labelAction,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const generatedId = useId();
  const inputId = props.id || generatedId;
  const errorId = `${inputId}-error`;

  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const effectiveType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`input-group ${className}`} style={{ marginBottom: 'var(--space-4)' }}>
      {(label || labelAction) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-1)',
          }}
        >
          {label && (
            <label htmlFor={inputId} className="input-label" style={{ margin: 0, fontWeight: 600, fontSize: '13px', color: 'var(--color-text-primary)' }}>
              {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
            </label>
          )}
          {labelAction && <div>{labelAction}</div>}
        </div>
      )}
      <div className="input-wrapper">
        {Icon && (
          <span className="input-icon-prefix">
            <Icon size={16} aria-hidden="true" />
          </span>
        )}
        <input
          id={inputId}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`input-field ${error ? 'has-error' : ''} ${Icon ? 'has-prefix' : ''} ${
            isPasswordType ? 'has-suffix' : ''
          }`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            className="input-icon-suffix"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <span id={errorId} className="input-error-msg" role="alert">
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
