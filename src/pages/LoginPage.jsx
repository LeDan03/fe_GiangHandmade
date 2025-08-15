import { useNavigate } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";
import AuthLayout from "../layouts/AuthLayout";

import SubmitButton from "../components/buttons/SubmitButton";
import ControlButton from "../components/buttons/controlButton";

import path from "../utils/path";

export default function LoginPage() {

    const navigate = useNavigate();

    return (
        <AuthLayout
            title="Đăng nhập"
            subtitle="Chào mừng bạn quay lại!"
        >
            <form className="space-y-5 w-full max-w-sm mx-auto">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                </div>
                <SubmitButton
                    onClick={() => {}}
                    classname="w-full bg-orange-500 hover:bg-lime-600 text-white font-semibold"
                    label="Đăng nhập"
                />

                <div className="flex items-center gap-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-gray-400 text-xs">Hoặc</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <ControlButton
                    onClick={() => {}}
                    label="Đăng nhập với Google"
                    icon={FcGoogle}
                    classname="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-lime-400 hover:text-white text-gray-600 font-semibold rounded-lg px-4 py-2"
                />

                <p className="text-xs text-gray-500 text-center">
                    Chưa có tài khoản?{" "}
                    <a href={path.REGISTER} className="text-indigo-500 hover:underline">
                        Đăng ký ngay
                    </a>
                </p>
            </form>
        </AuthLayout>
    );
}
