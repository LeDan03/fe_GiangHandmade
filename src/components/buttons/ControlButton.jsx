const ControlButton = ({ onClick, icon: Icon, label, classname }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center space-x-2 min-w-16 h-10 rounded transition-transform duration-200 shadow-md hover:shadow-lg hover:scale-105 ${classname}`}
            aria-label={label}
        >
            <Icon className="w-5 h-5 pl-1" />
            <p className="text-md pr-1">{label}</p>
        </button>
    );
};

export default ControlButton;
