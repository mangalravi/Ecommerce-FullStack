const Button = ({
  type = "button",
  onClick,
  className = "",
  children,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} bg-[#BB0100] hover:bg-[#BB0100] text-white text-center text-[0.875rem] font-medium py-[0.625rem] rounded-[2px] ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
