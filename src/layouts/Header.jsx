import { Search, Heart, ShoppingCart, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// các thafh phần
import ControlButton from '../components/buttons/controlButton';

import useAuthStore from '../store/useAuthStore';

// Các tiện ích
import path from '../utils/path';

export default function Header() {

    const navigate = useNavigate();

    const user = useAuthStore((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-green-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="text-2xl">🐱</div>
                        <h1 className="text-xl font-bold text-emerald-800">Yarn Cats</h1>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block flex-1 max-w-md mx-8">
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

                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200">
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200">
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        {!user && (
                            <>
                                <ControlButton
                                    onClick={() => { navigate(path.LOGIN) }}
                                    icon={LogIn}
                                    classname="bg-blue-500 text-white hover:bg-blue-600"
                                    label="Đăng nhập"
                                />

                                <ControlButton
                                    onClick={() => { navigate(path.REGISTER) }}
                                    icon={UserPlus}
                                    classname="bg-orange-500 text-white hover:bg-orange-600"
                                    label="Đăng ký"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Bar - Mobile */}
            <div className="md:hidden px-4 pb-3">
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
        </header>
    );
}