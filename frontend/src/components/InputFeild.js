import React from "react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
  inpcls = "",
  name,
}) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && (
        <label className="text-[#666666] font-bold mb-2 text-sm">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`border border-[#C2C2C2] rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-[#f5fafc] text-sm text-[#706A6A] ${inpcls}`}
      />
    </div>
  );
};

export default InputField;
