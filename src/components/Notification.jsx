import { useEffect } from "react";
import { X } from "lucide-react";

const Notification = ({ hide, title, message, onClose, type = "info" }) => {
    // Auto close sau 3s
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose?.();
        }, 10000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const baseStyle =
        "flex flex-col fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-lg text-white animate-fadeIn bg-green-100 min-w-96 max-w-96 min-h-32";
    const typeStyle = {
        success: "text-green-500 bg-green-100",
        error: "text-red-500 bg-red-100",
        info: "text-blue-500 bg-blue-100",
        warning: "text-yellow-500 bg-yellow-100",
    };

    return (
        <>
            {!hide && (
                <div className={`${baseStyle} ${typeStyle[type]}`}>
                    <div className="ml-auto rounded-full border-1 bg-white border-black bg-opacity-70 p-1 mr-2 inline-block align-middle">
                        <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500 hover:opacity-100" onClick={onClose} />
                    </div>
                    <div className={`flex flex-col items-center justify-center space-y-4`}>
                        <p className={`${typeStyle[type]} font-bold`}>{title.toUpperCase()}</p>
                        <p className="text-black text-center">{message}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Notification;