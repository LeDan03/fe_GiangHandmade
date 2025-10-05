import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

import path from "../utils/path.js";
import MainLayout from "../layouts/MainLayout.jsx";

import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import ManagePage from "../pages/ManagePage/ManagePage.jsx";
import OrderManagementPage from "../pages/OrderManagementPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import OrderPage from "../pages/OrderPage.jsx";

export const router = createBrowserRouter([
    {
        path: path.HOME,
        element: <MainLayout />, // MainLayout là route cha
        children: [
            {
                index: true, // route mặc định khi vào "/"
                element: <HomePage />
            },
            {
                path: path.PRODUCT_DETAIL,
                element: <ProductDetailPage />,
            },
            {
                path: path.ORDER_MANAGEMENT,
                element: <OrderManagementPage />,
            },
            {
                path: path.ORDER,
                element: <OrderPage />,
            }
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