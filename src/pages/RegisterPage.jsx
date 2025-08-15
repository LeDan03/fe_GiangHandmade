import { useNavigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import SubmitButton from "../components/buttons/SubmitButton";

import path from "../utils/path";

export default function RegisterPage() {

    const navigate = useNavigate();

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
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Tên tài khoản"
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
                <div>
                    <select
                        className="w-1/3 border border-gray-300 bg-emerald-50 rounded-lg px-4 py-2
                        text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        defaultValue="man"
                    >
                        <option value="man" className="rounded">Nam</option>
                        <option value="woman" className="rounded">Nữ</option>
                        <option value="others" className="rounded">Khác</option>
                    </select>
                </div>
                <SubmitButton
                    onClick={() => { }}
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
        </AuthLayout>
    );
}
