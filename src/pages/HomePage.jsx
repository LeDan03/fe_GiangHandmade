import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../store/useAuthStore';

// style
import '../styles/global.css';
import path from '../utils/path';

const HomePage = () => {

  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const currentUser = useAuthStore((state) => state.currentUser);

  const [favorites, setFavorites] = useState([]);

  // Dữ liệu sản phẩm nổi bật
  const featuredProducts = [
    {
      id: 1,
      name: "Mèo len xinh xắn",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
      price: "299,000₫",
      originalPrice: "399,000₫"
    },
    {
      id: 2,
      name: "Túi đeo chéo handmade",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      price: "450,000₫",
      originalPrice: "550,000₫"
    },
    {
      id: 3,
      name: "Khăn len ấm áp",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop",
      price: "199,000₫",
      originalPrice: "299,000₫"
    }
  ];

  // Danh mục sản phẩm
  const categories = [
    { id: 1, name: "Mèo len", icon: "🐱", color: "bg-emerald-100" },
    { id: 2, name: "Túi xách", icon: "👜", color: "bg-green-100" },
    { id: 3, name: "Khăn len", icon: "🧣", color: "bg-teal-100" },
    { id: 4, name: "Mũ len", icon: "🧢", color: "bg-mint-100" },
    { id: 5, name: "Gấu bông", icon: "🧸", color: "bg-emerald-50" },
    { id: 6, name: "Khác", icon: "✨", color: "bg-green-50" }
  ];

  // Danh sách sản phẩm
  const products = [
    {
      id: 1,
      name: "Mèo len màu trắng",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
      price: "250,000₫",
      rating: 4.8,
      reviews: 24
    },
    {
      id: 2,
      name: "Túi len handmade",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: "320,000₫",
      rating: 4.9,
      reviews: 18
    },
    {
      id: 3,
      name: "Khăn len xanh lá",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop",
      price: "180,000₫",
      rating: 4.7,
      reviews: 32
    },
    {
      id: 4,
      name: "Mũ len mèo con",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      price: "150,000₫",
      rating: 4.6,
      reviews: 15
    },
    {
      id: 5,
      name: "Gấu bông len",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
      price: "280,000₫",
      rating: 4.8,
      reviews: 21
    },
    {
      id: 6,
      name: "Móc khóa mèo len",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
      price: "89,000₫",
      rating: 4.5,
      reviews: 45
    }
  ];

  useEffect(() => {
    if (currentUser?.role === 'ADMIN') {
      navigate(path.MANAGE);
    }
  }, []);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Slider */}
        <section className="mb-12">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white">
            <div className="relative h-64 md:h-96">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                      ? 'opacity-0 -translate-x-full'
                      : 'opacity-0 translate-x-full'
                    }`}
                >
                  <div className="grid md:grid-cols-2 h-full">
                    <div className="flex flex-col justify-center p-8 bg-gradient-to-r from-emerald-600 to-green-500 text-white">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-pulse">
                        {product.name}
                      </h2>
                      <div className="space-y-2 mb-6">
                        <span className="text-2xl font-bold">{product.price}</span>
                        <span className="text-lg line-through text-green-200 ml-3">
                          {product.originalPrice}
                        </span>
                      </div>
                      <button className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 w-fit">
                        Mua ngay
                      </button>
                    </div>
                    <div className="hidden md:block">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-green-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-green-600 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
            Danh mục sản phẩm
          </h2>
          <div className="flex overflow-x-auto md:grid md:grid-cols-6 gap-4 pb-4 md:pb-0">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`flex-shrink-0 ${category.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 min-w-[140px] md:min-w-0`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-emerald-800 text-sm">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* Products Grid */}
        <section>
          <h2 className="text-2xl font-bold text-emerald-800 mb-6 text-center">
            Sản phẩm
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 md:h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${favorites.includes(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                  >
                    <Heart className="w-4 h-4" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-emerald-800 mb-2 text-sm md:text-base line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">
                      {product.price}
                    </span>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40">
        <div className="text-xl">🐱</div>
      </button>

    </div>
  );
};

export default HomePage;