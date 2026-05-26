const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center gap-2 font-medium tracking-widest text-xs uppercase transition-all duration-300 cursor-pointer';
  const variants = {
    primary: 'bg-[#C9A96E] text-white px-8 py-3.5 hover:bg-[#b8935a]',
    outline: 'border border-[#C9A96E] text-[#C9A96E] px-8 py-3.5 hover:bg-[#C9A96E] hover:text-white',
    dark:    'bg-[#1A1714] text-white px-8 py-3.5 hover:bg-[#2C2823]',
    ghost:   'text-[#C9A96E] hover:text-[#b8935a] underline-offset-4 hover:underline px-0 py-0',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;