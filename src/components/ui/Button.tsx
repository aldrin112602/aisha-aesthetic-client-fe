import type { ButtonProps, ButtonVariant } from '../../types';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#df7f98] text-white hover:bg-[#d66f8c]',
  secondary: 'border border-pink-100 bg-white text-[#5b3e45] hover:bg-[#fff4f6]',
  danger: 'bg-[#fee5e5] text-[#c1433f] hover:bg-[#fdd5d5]',
  ghost: 'text-[#5b3e45] hover:bg-[#fff4f6]',
};

function Button({
  children,
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
