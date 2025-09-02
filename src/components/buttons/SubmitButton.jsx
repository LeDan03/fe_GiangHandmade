const SubmitButton = ({ onClick, icon: Icon, label, classname, loading }) => {
    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={loading}
            className={`flex items-center justify-center space-x-2 min-w-10 h-10 rounded transition-transform 
                        duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 
                        disabled:cursor-not-allowed ${classname}`}
            aria-label={label}
        >
            {loading ? (
                <div className="flex justify-center items-center w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                    {Icon && <Icon className={`w-5 h-5 ${label ? 'pl-1' : ''}`} />}
                    {label && <p className="text-md pr-1">{label}</p>}
                </>
            )}
        </button>
    );
};

export default SubmitButton;
