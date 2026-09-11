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
      className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c66b83] disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
