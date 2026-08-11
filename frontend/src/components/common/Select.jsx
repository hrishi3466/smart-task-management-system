import React, { useId } from 'react';

/**
 * Reusable Select Dropdown Component
 */
export const Select = ({
  label,
  value,
  onChange,
  options = [], // Array of { value, label }
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const selectId = props.id || generatedId;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="input-label">
          {label} {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input-field ${error ? 'has-error' : ''}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="input-error-msg" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
