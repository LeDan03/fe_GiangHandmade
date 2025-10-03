import { useNavigate } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

import AuthLayout from "../layouts/AuthLayout";

import SubmitButton from "../components/buttons/submitButton";
import ControlButton from "../components/buttons/controlButton";

import path from "../utils/path";
import { useState } from "react";
import AuthService from "../services/AuthService";
import { HttpStatusCode } from "axios";
import useAuthStore from "../store/useAuthStore";
import Notification from "../components/Notification";

export default function LoginPage() {

    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loginResult, setLoginResult] = useState({ hide: true, title: "", message: "", onclose: () => { }, type: "info" })

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await AuthService.login(loginData);
            if (result && result.status === HttpStatusCode.Ok) {
                useAuthStore.getState().setCurrentUser(result.data.user)
                if (result.data.user.role === "ADMIN") {
                    navigate(path.MANAGE);
                }
                else { navigate(path.HOME); }
            }
        } catch (error) {
            let message = "Vui lòng thử lại.";
            if (error.response && error.response.data && error.response.data.message) {
                message = error.response.data.message;
            }
            setLoginResult({
                hide: false,
                title: "Đăng nhập thất bại",
                message,
                type: "error",
                onclose: () => {
                    setLoginResult({ hide: true, title: "", message: "", onclose: () => { }, type: "info" });
                }
            });
        }
    }

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8089/oauth2/authorization/google";
    }


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
                        value={loginData.email}
                        onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                </div>
                <SubmitButton
                    onClick={(e) => { handleEmailLogin(e) }}
                    classname="w-full bg-orange-500 hover:bg-lime-600 text-white font-semibold"
                    label="Đăng nhập"
                />

                <div className="flex items-center gap-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-gray-400 text-xs">Hoặc</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <ControlButton
                    onClick={() => { handleGoogleLogin() }}
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
            <Notification
                hide={loginResult.hide}
                title={loginResult.title}
                type={loginResult.type}
                message={loginResult.message}
                onClose={loginResult.onclose}
            />
        </AuthLayout>
    );
}
