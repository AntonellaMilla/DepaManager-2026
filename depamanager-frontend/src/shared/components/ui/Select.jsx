import { AlertCircle } from 'lucide-react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  disabled = false,
  isLoading = false,
  placeholder = 'Selecciona una opción',
  required = false,
  icon: Icon
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled || isLoading}
          className={`
            w-full 
            ${Icon ? 'pl-10' : 'px-4'} 
            py-3 
            border 
            rounded-xl 
            focus:outline-none 
            focus:ring-2 
            focus:ring-offset-2 
            transition-all 
            font-medium
            ${error 
              ? 'border-red-300 focus:ring-red-500 bg-red-50' 
              : 'border-gray-300 focus:ring-blue-500'
            }
            ${disabled || isLoading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'}
          `}
        >
          <option value="">{isLoading ? 'Cargando...' : placeholder}</option>
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;
