import { Link } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-100 px-4">
            <div className="w-full max-w-md rounded-2xl shadow-lg bg-white">
                {/* Logo / Header */}
                <div className="text-center mb-6 w-full bg-lime-100 p-8 rounded-t-2xl">
                    <Link to="/" className="block mb-4">
                        <div className="relative inline-block">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-20 h-20 mx-auto rounded-full border-4 border-white shadow-lg ring-3 ring-yellow-200 shadow-red-300"
                            />
                        </div>
                    </Link>

                    <h1 className="text-2xl font-bold text-black">{title}</h1>
                    {subtitle && (
                        <p className="text-lime-600 text-sm mt-1">{subtitle}</p>
                    )}
                </div>

                {/* Nội dung form */}
                {children}

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-gray-400 p-8">
                    © {new Date().getFullYear()} PandaDev-LeDan. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
