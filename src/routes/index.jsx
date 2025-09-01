import { createBrowserRouter } from "react-router-dom";

import path from "../utils/path.js";
import MainLayout from "../layouts/MainLayout.jsx";

import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ManagePage from "../pages/ManagePage/ManagePage.jsx";

export const router = createBrowserRouter([
    {
        path: path.HOME,
        element: <MainLayout />, // MainLayout là route cha
        children: [
            {
                index: true, // route mặc định khi vào "/"
                element: <HomePage />
            },
        ]
    },
    {
        path: path.LOGIN,
        element: <LoginPage />
    },
    {
        path: path.REGISTER,
        element: <RegisterPage />
    },
    {
        path: path.MANAGE,
        element: <ManagePage />
    }
])