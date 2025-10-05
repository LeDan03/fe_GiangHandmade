import React, { useState, useEffect, use } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../store/useAuthStore';
import useCommonStore from '../store/useCommonStore';
import usePersonalStore from '../store/usePersonalStore';
import useCartIconStore from '../store/useCartIconStore';

import UserService from '../services/UserService';

import FlyingItem from '../components/FlyingItem';

// style
import '../styles/global.css';
import path from '../utils/path';
import { HttpStatusCode } from 'axios';

const HomePage = () => {

  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const cart = usePersonalStore((state) => state.cart);
  const cartItems = cart.items || [];
  const addItem = usePersonalStore((state) => state.addItem);
  const updateItem = usePersonalStore((state) => state.updateItem);

  const getItemQuantityByProductId = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

  const cartRect = useCartIconStore((state) => state.cartRect);
  const [flyingItems, setFlyingItems] = useState([]);
  const handleAddToCart = (product, e) => {
    if (!currentUser) {
      navigate(path.LOGIN);
      return;
    }
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    if (cartRect) {
      const endPos = {
        x: cartRect.left + cartRect.width / 2,
        y: cartRect.top + cartRect.height / 2,
      };

      setFlyingItems(prev => [
        ...prev,
        {
          id: Date.now(),
          product,
          start: startPos,
          end: endPos,
        }
      ]);
      console.log("Quỹ đạo bay", startPos, endPos);
    }


    // thêm item vào store
    getItemQuantityByProductId(product.id) === 0
      ? addItem({
        cartId: currentUser.cartId,
        quantity: 1,
        productId: product.id,
      })
      : updateItem(
        cartItems.find(item => item.productId === product.id).id,
        getItemQuantityByProductId(product.id) + 1
      );
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const result = await UserService.getMe();
      console.log("fetch user", result);
      if (result && result.status === HttpStatusCode.Ok) {
        setCurrentUser(result.data);
      }
    }
    if (!currentUser) {
      fetchUserData();
    }
  }, []);

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
  const categories = useCommonStore((state) => state.categories);
  const fetchCategories = useCommonStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  // Danh sách sản phẩm
  const products = useCommonStore((state) => state.products);
  const fetchProducts = useCommonStore((state) => state.fetchProducts);

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

  useEffect(() => {
    try {
      if (products.length === 0) {
        fetchProducts();
      }
    } catch (error) {
      console.warn("Lấy danh sách sản phẩm thất bại", error);
    }
  }, [products]);

  return (
    <div className="min-h-screen rounded-2xl">
      <main className="w-full rounded-2xl">
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
            {categories.map((category, index) => {
              const half = Math.ceil(categories.length / 2);
              const isFirstHalf = index < half;

              return (
                <div
                  key={category.id}
                  className={`flex-shrink-0 rounded-2xl p-6 text-center cursor-pointer 
            hover:shadow-lg transition-all duration-300 transform 
            hover:scale-105 hover:-translate-y-1 min-w-[140px] md:min-w-0 
            ${isFirstHalf ? "bg-lime-400" : "bg-emerald-400"}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: "fadeInUp 0.6s ease-out forwards",
                  }}
                >
                  <div className="text-4xl mb-3 flex justify-center items-center">
                    <Box className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">{category.name}</h3>
                </div>
              );
            })}
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
                onClick={() => {
                  currentUser ? navigate(`/product/${product.id}`) : navigate(path.LOGIN);
                }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className="relative">
                  <img
                    src={product?.images?.[0]?.secureUrl || '/images/default-product-img.png'}
                    alt={product.name}
                    className="w-full h-32 md:h-48 object-cover cursor-pointer"
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
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <button
                      onClick={(e) => { handleAddToCart(product, e); }}
                      className={`${currentUser ? 'bg-emerald-400 hover:bg-emerald-600' : 'bg-emerald-300'} text-white p-2 rounded-full transition-all duration-300 transform hover:scale-110`}
                    >
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
      {flyingItems.map(item => (
        <FlyingItem
          key={item.id}
          product={item.product}
          start={item.start}
          end={item.end}
          onFinish={() => setFlyingItems(prev => prev.filter(f => f.id !== item.id))}
        />
      ))}
    </div>
  );
};

export default HomePage;