const ActionButton = ({ children, variant = 'primary', onClick, className = '', ref=null }) => {
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2";
    const variants = {
        primary: "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
        secondary: "bg-green-100 hover:bg-green-200 text-green-700",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    };

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default ActionButton;