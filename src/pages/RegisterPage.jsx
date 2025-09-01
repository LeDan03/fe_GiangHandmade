import { useNavigate } from "react-router-dom";
import { useState } from "react";


import AuthService from "../services/AuthService";

import AuthLayout from "../layouts/AuthLayout";

import SubmitButton from "../components/buttons/submitButton";
import Notification from "../components/Notification";

import path from "../utils/path";
import validators from "../utils/validators";
import { HttpStatusCode } from "axios";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        email: "",
        name: "",
        password: "",
        gender: "male",
        authProviders: "EMAIL"
    });

    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [registerResult, setRegisterResult] = useState({ hide: true, title: "", message: "", onclose: () => { }, type: "info" });
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Register data:", registerData);
        let isValid = true;
        if (!validators.isValidEmail(registerData.email)) {
            setEmailError("Email không hợp lệ");
            isValid = false;
        }
        if (!validators.isValidUsername(registerData.name)) {
            setUsernameError("Tên tài khoản phải dài ít nhất 3 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới, dấu cách");
            isValid = false;
        }
        if (!validators.isValidPassword(registerData.password)) {
            setPasswordError("Mật khẩu phải dài ít nhất 8 ký tự");
            isValid = false;
        }
        if (!isValid) return;
        try {
            const registerResult = await AuthService.register(registerData);

            if (registerResult && registerResult.status === HttpStatusCode.Ok) {
                setRegisterResult({
                    hide: false,
                    title: "Đăng ký thành công",
                    message: "Vui lòng kiểm tra email để xác thực tài khoản.",
                    type: "success",
                    onclose: () => {
                        setRegisterResult({ hide: true, title: "", message: "", onclose: () => { }, type: "info" });
                        setIsLoading(false);
                        navigate(path.LOGIN);
                    }
                });
            }
        } catch (error) {
            let message = "Vui lòng thử lại.";
            console.warn("Register error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                message = error.response.data.message;
            }
            setRegisterResult({
                hide: false,
                title: "Đăng ký thất bại",
                message,
                type: "error",
                onclose: () => {
                    setRegisterResult({ hide: true, title: "", message: "", onclose: () => { }, type: "info" });
                    setIsLoading(false);
                }
            });
        }
    }

    return (
        <AuthLayout
            title="Đăng ký"
            subtitle="Tạo tài khoản để mua sắm dễ dàng hơn!"
        >
            <form className="space-y-5 w-full max-w-sm mx-auto">
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={registerData.email}
                        onChange={(e) => {
                            setRegisterData({ ...registerData, email: e.target.value });
                            setEmailError("");
                        }}
                    />
                    <span className="text-xs text-red-500">{emailError}</span>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Tên tài khoản"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={registerData.name}
                        onChange={(e) => {
                            setRegisterData({ ...registerData, name: e.target.value });
                            setUsernameError("");
                        }}
                    />
                    <span className="text-xs text-red-500">{usernameError}</span>
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={registerData.password}
                        onChange={(e) => {
                            setRegisterData({ ...registerData, password: e.target.value });
                            setPasswordError("")
                        }
                        }
                    />
                    <span className="text-xs text-red-500">{passwordError}</span>
                </div>
                <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={registerData.gender === "male"}
                            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                            className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Nam</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={registerData.gender === "female"}
                            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                            className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Nữ</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={registerData.gender === "other"}
                            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                            className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>Khác</span>
                    </label>
                </div>

                <SubmitButton
                    onClick={(e) => { handleRegister(e); }}
                    classname="w-full bg-orange-500 hover:bg-red-600 text-white font-semibold"
                    label="Đăng ký tài khoản"
                    loading={isLoading}
                />

                <div className="flex items-center gap-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="text-gray-400 text-xs">Hoặc</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    Đã có tài khoản?{" "}
                    <a href={path.LOGIN} className="text-indigo-500 hover:underline">
                        Đăng nhập ngay
                    </a>
                </p>
            </form>
            <Notification
                hide={registerResult.hide}
                title={registerResult.title}
                message={registerResult.message}
                type={registerResult.type}
                onClose={registerResult.onclose} />
        </AuthLayout>
    );
}

export default RegisterPage;   