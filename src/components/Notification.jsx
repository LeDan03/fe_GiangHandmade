import { useEffect } from "react";

const Notification = ({ hide, message, onClose, type = "info" }) => {
    // Auto close sau 3s
    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            onClose?.();
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, onClose]);

    if (!message) return null;

    const baseStyle =
        "fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-lg text-white animate-fadeIn";
    const typeStyle = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
        warning: "bg-yellow-500 text-black",
    };

    return (
        <>
            {!hide && (
                <div className={`${baseStyle} ${typeStyle[type]}`}
                    onClose={onClose}>
                    {message}
                </div>
            )}
        </>
    );
}

export default Notification;