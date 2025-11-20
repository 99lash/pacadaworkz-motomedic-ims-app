import React from "react";
import { motion } from "motion/react";
interface ButtonPrimaryProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const baseClasses =
    "bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-gray-800 font-bold py-4 px-6 rounded-2xl shadow-md hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200";

  return (
    <motion.button
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      type={type}
      className={`${baseClasses} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default ButtonPrimary;
