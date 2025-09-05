import { Search, Heart, ShoppingCart, LogIn, LogOut, UserPlus, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// các thành phần
import ControlButton from '../components/buttons/controlButton';
import SubmitButton from '../components/buttons/submitButton';
import Logo from '../components/Logo';

import useAuthStore from '../store/useAuthStore';

// Các tiện ích
import path from '../utils/path';

export default function Header() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.currentUser);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        useAuthStore.getState().logout();
        sessionStorage.clear();
        navigate(path.HOME);
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
    }

    return (
        <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo và Brand */}
                    <div className="flex items-center space-x-2">
                        <Logo />
                        <h1 className="text-lg sm:text-xl font-bold text-emerald-800">Giang Handmade</h1>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:block flex-1 max-w-md mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <>
                                <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200 hover:scale-105">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200 hover:scale-105">
                                    <ShoppingCart className="w-5 h-5" />
                                </button>

                                {/* User Menu Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center space-x-2 p-2 text-emerald-700 hover:bg-green-100 rounded-full transition-colors duration-200"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="text-sm font-medium hidden lg:block">
                                            {user.name || 'Tài khoản'}
                                        </span>
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                Xin chào, {user.name || 'User'}
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <ControlButton
                                    onClick={() => navigate(path.LOGIN)}
                                    icon={LogIn}
                                    classname="bg-blue-500 text-white hover:bg-blue-600 text-sm px-3 py-2"
                                    label="Đăng nhập"
                                />
                                <ControlButton
                                    onClick={() => navigate(path.REGISTER)}
                                    icon={UserPlus}
                                    classname="bg-orange-500 text-white hover:bg-orange-600 text-sm px-3 py-2"
                                    label="Đăng ký"
                                />
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-emerald-700 hover:bg-green-100 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Search Bar - Tablet */}
                <div className="hidden md:block lg:hidden px-4 pb-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-green-100 shadow-lg">
                    {/* Mobile Search */}
                    <div className="px-4 py-3 border-b border-green-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                            />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="px-4 py-2">
                        {user ? (
                            <div className="space-y-2">
                                {/* User Info */}
                                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                    <User className="w-6 h-6 text-emerald-600" />
                                    <div>
                                        <p className="text-sm font-medium text-emerald-800">
                                            {user.name || 'Người dùng'}
                                        </p>
                                        <p className="text-xs text-emerald-600">
                                            {user.email || 'email@example.com'}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-2 gap-3 py-2">
                                    <button className="flex items-center justify-center space-x-2 p-3 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors">
                                        <Heart className="w-5 h-5" />
                                        <span className="text-sm font-medium">Yêu thích</span>
                                    </button>
                                    <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                        <ShoppingCart className="w-5 h-5" />
                                        <span className="text-sm font-medium">Giỏ hàng</span>
                                    </button>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center space-x-2 p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border-t border-red-100 mt-3"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Đăng xuất</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 py-2">
                                <button
                                    onClick={() => {
                                        navigate(path.LOGIN);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span className="font-medium">Đăng nhập</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate(path.REGISTER);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    <span className="font-medium">Đăng ký</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Backdrop để đóng dropdown khi click outside */}
            {(isUserMenuOpen || isMobileMenuOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsMobileMenuOpen(false);
                    }}
                />
            )}
        </header>
    );
}