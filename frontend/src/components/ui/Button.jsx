import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const variantMap = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
};

const Button = ({ children, variant = 'primary', loading, icon: Icon, className, disabled, ...props }) => {
  return (
    <button className={clsx(variantMap[variant], className)} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
};

export default Button;
