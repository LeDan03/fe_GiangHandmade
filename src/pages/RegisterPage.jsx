import { useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthService from "../services/AuthService";

import AuthLayout from "../layouts/AuthLayout";

import SubmitButton from "../components/buttons/SubmitButton";
import Notification from "../components/Notification";

import path from "../utils/path";
import validators from "../utils/validators";
import { HttpStatusCode } from "axios";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        email: "",
        username: "",
        password: "",
        gender: "male",
        authProviders: "EMAIL"
    });

    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [registerResult, setRegisterResult] = useState({ hide: true, message: "", onClose: () => { }, type: "info" });

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Register data:", registerData);
        let isValid = true;
        if (!validators.isValidEmail(registerData.email)) {
            setEmailError("Email không hợp lệ");
            isValid = false;
        }
        if (!validators.isValidUsername(registerData.username)) {
            setUsernameError("Tên tài khoản phải dài ít nhất 3 ký tự và chỉ chứa chữ cái, số và dấu gạch dưới, dấu cách");
            isValid = false;
        }
        if (!validators.isValidPassword(registerData.password)) {
            setPasswordError("Mật khẩu phải dài ít nhất 8 ký tự");
            isValid = false;
        }
        if (!isValid) return;
        const registerResult = await AuthService.register(registerData);
        if (registerResult && registerResult.status === HttpStatusCode.Created) {
            // navigate(path.LOGIN, { state: { message: "Đăng ký thành công! Vui lòng đăng nhập." } });
            setRegisterResult({
                hide: false,
                message: "Đăng ký thành công! Vui lòng đăng nhập.",
                type: "success",
                onClose: () => { }
            });
        } else {
            setRegisterResult({
                hide: false,
                message: "Đăng ký thất bại. Vui lòng thử lại.",
                type: "error",
                onClose: () => { }
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
                        value={registerData.username}
                        onChange={(e) => {
                            setRegisterData({ ...registerData, username: e.target.value });
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
                <div>
                    <select
                        className="w-1/3 border border-gray-300 bg-emerald-50 rounded-lg px-4 py-2
                        text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={registerData.gender}
                        onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                    >
                        <option value="male" className="rounded">Nam</option>
                        <option value="female" className="rounded">Nữ</option>
                        <option value="other" className="rounded">Khác</option>
                    </select>
                </div>
                <SubmitButton
                    onClick={(e) => { handleRegister(e); }}
                    classname="w-full bg-orange-500 hover:bg-red-600 text-white font-semibold"
                    label="Đăng ký tài khoản"
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
                message={registerResult.message}
                type={registerResult.type}
                onClose={() => setRegisterResult({ ...registerResult, hide: true })} />
        </AuthLayout>
    );
}

export default RegisterPage;   