export default function Button({ 
  children= "Signup", 
  variant = "login", 
  onClick, 
  type = "button", 
  className = "" 
}) {
  const base = "px-8 py-6 rounded-xl font-medium transition duration-200 focus:outline-none";

  const styles = {
    default: "bg-gray-300 text-black hover:bg-gray-400",
    signup: "bg-green-600 text-white hover:bg-green-700",
    login: "bg-blue-600 text-white hover:bg-blue-700",
    submit: "bg-yellow-500 text-black hover:bg-yellow-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
