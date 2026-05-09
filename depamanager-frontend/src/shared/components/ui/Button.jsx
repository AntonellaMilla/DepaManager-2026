import { forwardRef } from 'react';
import { getButtonVariant, getButtonSize } from './config/uiConfig';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  type = 'button',
  loading = false,
  icon: Icon = null,
  ...props 
}, ref) => {

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantStyles = getButtonVariant(variant);
  const sizeStyles = getButtonSize(size);

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles.base} ${variantStyles.focus} ${sizeStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
          {children}
        </>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          {children}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;