import React from "react";

type ButtonProps = {
  type: "button" | "submit";
  title: string;
  icon?: React.ReactNode; // Accept a React node for the icon
  variant: string;
  onClick?: () => void;
};

const Button = ({ type, title, icon, variant, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`!py-2 !px-5 flexCenter gap-8 rounded-full border ${variant} hover:cursor-pointer`}
      onClick={onClick}
    >
  
      <label className="bold-16 whitespace-nowrap hover:cursor-pointer">{icon} {title}</label>
    </button>
  );
};

export default Button;
