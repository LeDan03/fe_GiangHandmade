import { Search, Heart, ShoppingCart, LogIn, LogOut, UserPlus, Menu, X, User, Package, Truck, CheckCircle, Clock, Home, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// các thành phần
import ControlButton from '../components/buttons/controlButton';
import Logo from '../components/Logo';

import useAuthStore from '../store/useAuthStore';
import useProductStore from '../store/useProductStore';
import useUserMenuStore from '../store/useUserMenuStore';
import usePersonalStore from '../store/usePersonalStore';
import useCartIconStore from '../store/useCartIconStore';

// Các tiện ích
import path from '../utils/path';

export default function Header() {
    const navigate = useNavigate();

    const user = useAuthStore((state) => state.currentUser);
    const [searchTerm, setSearchTerm] = useState('');
    const searchProducts = useProductStore((state) => state.searchProducts);
    const isSearching = useProductStore((state) => state.isSearching);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isUserMenuOpen = useUserMenuStore((state) => state.isUserMenuOpen);
    const toggleUserMenu = useUserMenuStore((state) => state.toggleUserMenu);
    const closeUserMenu = useUserMenuStore((state) => state.closeUserMenu);

    const cart = usePersonalStore((state) => state.cart);
    const fetchCart = usePersonalStore((state) => state.fetchCart);

    const cartRef = useRef(null);
    const setCartRect = useCartIconStore((state) => state.setCartRect);

    useEffect(() => {
        if (cartRef.current) {
            const rect = cartRef.current.getBoundingClientRect();
            setCartRect(rect);
            // update rect on resize/scroll
            const update = () => setCartRect(cartRef.current.getBoundingClientRect());
            window.addEventListener("resize", update);
            window.addEventListener("scroll", update, true);
            return () => {
                window.removeEventListener("resize", update);
                window.removeEventListener("scroll", update, true);
            };
        }
    }, [cartRef.current, setCartRect]);

    useEffect(() => {
        if (user) fetchCart(user.id);
    }, [user?.id]);

    const handleLogout = () => {
        useAuthStore.getState().logout();
        sessionStorage.clear();
        navigate(path.HOME);
        closeUserMenu();
        setIsMobileMenuOpen(false);
    }

    useEffect(() => {
        const handleSearch = setTimeout(() => {
            if (searchTerm.trim() !== '') {
                searchProducts(searchTerm.trim());
            } else {
                useProductStore.getState().clearSearch();
            }
        }, 500)
        return () => clearTimeout(handleSearch);
    }, [searchTerm, searchProducts]);

    // Helper function để lấy chữ cái đầu của tên
    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-green-100">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">

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
                                <button className="relative p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200 hover:scale-105"
                                    onClick={() => navigate(`/customer/${user.id}`)}
                                    ref={cartRef}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {cart?.quantity > 0 && (
                                        <span className="absolute flex items-center justify-center 
                                                            min-w-[14px] h-[14px] -top-1 -right-1 
                                                            bg-red-500 text-white text-xs font-bold 
                                                            rounded-full">
                                            {cart.quantity || 0}
                                        </span>

                                    )}
                                </button>
                                <div className='flex rounded-full text-green-600 hover:bg-orange-500 hover:text-white transition-colors duration-200 hover:scale-105'

                                    onClick={() => navigate(path.HOME)}
                                >
                                    <Home className='p-2 w-9 h-9' />
                                </div>
                                {/* User Avatar Button */}
                                <div className="relative">
                                    <button
                                        onClick={toggleUserMenu}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
                                    >
                                        {getInitials(user.name || user.username)}
                                    </button>
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

            {/* Desktop User Menu Dropdown */}
            {isUserMenuOpen && user && (
                <div className="hidden md:block absolute right-4 top-20 w-80 bg-white rounded-2xl shadow-2xl border border-green-100 overflow-hidden z-50 animate-slide-down">
                    {/* Header với Avatar và Info */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {getInitials(user.name || user.username)}
                            </div>
                            <div className="flex-1 text-white">
                                <h3 className="font-semibold text-lg truncate">
                                    {user.name || user.username || 'Người dùng'}
                                </h3>
                                <p className="text-emerald-100 text-sm truncate">
                                    {user.email || 'email@example.com'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-3">
                        <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors group">
                            <User className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Quản lý tài khoản</span>
                        </button>

                        <button className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-emerald-50 rounded-lg transition-colors group"
                            onClick={() => {
                                closeUserMenu();
                                navigate(`/customer/${user.id}`)
                            }}
                        >
                            <ShoppingBag className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Quản lý đơn hàng</span>
                        </button>

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Đăng xuất</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-green-100 shadow-lg animate-slide-down">
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
                    <div className="px-4 py-2 animate-slide-down" >
                        {user ? (
                            <div className="space-y-2">
                                {/* User Info với Avatar */}
                                <div className="flex items-center space-x-3 p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
                                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0">
                                        {getInitials(user.name || user.username)}
                                    </div>
                                    <div className="flex-1 min-w-0 text-white">
                                        <p className="text-base font-semibold truncate">
                                            {user.name || user.username || 'Người dùng'}
                                        </p>
                                        <p className="text-sm text-emerald-100 truncate">
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

                                {/* Order Management Menu Items */}
                                <div className="space-y-2 pt-2">
                                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                        <User className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm font-medium">Thông tin cá nhân</span>
                                    </button>

                                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Package className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-medium">Đơn hàng đã mua</span>
                                    </button>

                                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm font-medium">Đơn hàng đang xử lý</span>
                                    </button>

                                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                        <Truck className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm font-medium">Đang vận chuyển</span>
                                    </button>

                                    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm font-medium">Đã hoàn thành</span>
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
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => {
                        closeUserMenu();
                        setIsMobileMenuOpen(false);
                    }}
                />
            )}
        </header>
    );
}