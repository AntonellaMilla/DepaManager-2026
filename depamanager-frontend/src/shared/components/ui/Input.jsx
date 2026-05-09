import { AlertCircle, CheckCircle } from 'lucide-react';
import { INPUT_STYLES } from './config/uiConfig';

const Input = ({ 
  label, 
  error, 
  success = false,
  disabled = false,
  hint = '',
  required = false,
  className = '',
  ...props 
}) => {
  let inputStyle = INPUT_STYLES.default;
  
  if (disabled) {
    inputStyle = INPUT_STYLES.disabled;
  } else if (error) {
    inputStyle = INPUT_STYLES.error;
  } else if (success) {
    inputStyle = INPUT_STYLES.success;
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          className={`${INPUT_STYLES.base} ${INPUT_STYLES.focus} ${inputStyle} ${className}`}
          disabled={disabled}
          {...props}
        />
        
        {/* Ícono de validación */}
        {!disabled && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {error ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : success ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : null}
          </div>
        )}
      </div>

      {/* Mensaje de error o hint */}
      {error && (
        <div className="flex items-center gap-1 mt-2 text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default Input;