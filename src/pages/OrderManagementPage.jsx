import React, { useState } from 'react';
import { ShoppingCart, Package, XCircle, CheckCircle, Star, Clock, TrendingUp, Search, Filter, ChevronRight, Plus, Minus, Menu, X } from 'lucide-react';

import usePersonalStore from '../store/usePersonalStore';
import useCommonStore from '../store/useCommonStore';

import ActionButton from '../components/buttons/ActionButton';
import { useNavigate } from 'react-router-dom';
import path from '../utils/path';

const OrderManagementPage = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('cart');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cart = usePersonalStore((state) => state.cart);
  const products = useCommonStore((state) => state.products);
  console.log('Cart:', cart);
  const cartItems = cart?.items || [];
  console.log('Cart Items:', cartItems);

  const updateItem = usePersonalStore(state => state.updateItem);
  const removeItem = usePersonalStore(state => state.removeItem);

  const handleUpdateItem = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeItem([itemId]);
    };
    await updateItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemIds) => {
    await removeItem(itemIds);
    setSelectedItems(prev => prev.filter(id => !itemIds.includes(id)));
  }

  const shippingOrders = [
    { id: 'DH001', productName: 'iPhone 15 Pro Max', date: '25/09/2025', time: '14:30', total: 15990000, items: 2, status: 'Đang giao', eta: '3-5 ngày', image: '📦', color: 'Titan Tự Nhiên' },
    { id: 'DH002', productName: 'AirPods Pro Gen 2', date: '28/09/2025', time: '09:15', total: 8490000, items: 1, status: 'Đã lấy hàng', eta: '2-4 ngày', image: '🚚', color: 'Trắng' },
  ];

  const completedOrders = [
    { id: 'DH003', productName: 'MacBook Pro M3', date: '15/09/2025', time: '16:45', total: 25990000, items: 3, status: 'Hoàn thành', image: '✅', color: 'Xám Không Gian' },
    { id: 'DH004', productName: 'iPad Pro 12.9', date: '10/09/2025', time: '11:20', total: 12490000, items: 2, status: 'Hoàn thành', image: '✅', color: 'Bạc' },
  ];

  const canceledOrders = [
    { id: 'DH005', productName: 'Apple Watch Ultra 2', date: '20/09/2025', time: '13:00', total: 5990000, items: 1, status: 'Đã hủy', reason: 'Khách hàng yêu cầu', image: '❌', color: 'Titan' },
  ];

  const reviewOrders = [
    { id: 'DH006', productName: 'iPhone 15 Pro Max', date: '18/09/2025', time: '10:30', total: 18990000, items: 2, status: 'Chờ đánh giá', image: '⭐', color: 'Xanh Titan' },
    { id: 'DH007', productName: 'AirPods Max', date: '16/09/2025', time: '15:20', total: 12990000, items: 1, status: 'Chờ đánh giá', image: '⭐', color: 'Xanh Lá' },
  ];

  const tabs = [
    { id: 'cart', name: 'Giỏ Hàng', icon: ShoppingCart, count: cartItems.length, color: 'from-purple-500 to-pink-500' },
    { id: 'shipping', name: 'Vận Chuyển', icon: Package, count: shippingOrders.length, color: 'from-blue-500 to-cyan-500' },
    { id: 'completed', name: 'Hoàn Thành', icon: CheckCircle, count: completedOrders.length, color: 'from-green-500 to-emerald-500' },
    { id: 'review', name: 'Đánh Giá', icon: Star, count: reviewOrders.length, color: 'from-yellow-500 to-orange-500' },
    { id: 'canceled', name: 'Đã Hủy', icon: XCircle, count: canceledOrders.length, color: 'from-red-500 to-rose-500' },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.id));
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        const product = products.find(p => p.id === item.productId);
        const price = product?.price || 0;
        return total + price * item.quantity;
      }, 0)
  };

  const renderCartContent = () => (
    <div className="space-y-3 pb-24 md:pb-4">
      {/* Select All - Compact for mobile */}
      <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center flex-row ${selectedItems.length > 0 ? 'justify-center' : ''} gap-3`}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="font-medium text-sm text-gray-700">
            Chọn tất cả <span className="text-purple-600">({selectedItems.length}/{cartItems.length})</span>
          </span>
        </label>
        {selectedItems.length > 0 && (
          <div className='ml-auto mr-8 flex flex-col space-x-4'>
            <ActionButton variant='danger' onClick={() => { removeItem(selectedItems); setSelectedItems([]) }}>Xóa nhiều</ActionButton>
          </div>
        )}
      </div>

      {/* Cart Items - Optimized for mobile */}
      {cartItems?.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        const product = products.find(p => p.id === item.productId) || {};
        return (
          <div
            key={item.id}
            className={`bg-white rounded-xl p-3 shadow-sm transition-all duration-200 border-2 ${isSelected ? 'border-purple-400 shadow-md' : 'border-gray-100'
              }`}
          >
            <div className="flex gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectItem(item.id)}
                className="w-4 h-4 mt-1 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer flex-shrink-0"
              />

              {/* Product Image */}
              <div className="text-4xl md:text-5xl bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-2 md:p-3 flex items-center justify-center flex-shrink-0">
                <img src={product?.images?.[0]?.secureUrl || '/public/images/default-product-img.png'}
                  alt={item?.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 truncate">{product?.name || 'Sản phẩm'}</h3>
                {/* <p className="text-xs text-gray-500 mb-2">{item.color}</p> */}

                {/* Price and Quantity - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1">
                    <button className="text-gray-600 hover:text-purple-600 w-6 h-6 flex items-center justify-center"
                      onClick={() => handleUpdateItem(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-semibold text-sm w-6 text-center">{item.quantity}</span>
                    <button className="text-gray-600 hover:text-purple-600 w-6 h-6 flex items-center justify-center"
                      onClick={() => handleUpdateItem(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className='font-bold'>Giá: </p>
                  <span className="text-base md:text-lg font-bold text-purple-600">
                    {formatPrice(product?.price)}
                  </span>
                </div>
              </div>

              {/* Delete Button */}
              <button className="text-red-500 hover:text-red-600 p-1 rounded-lg transition-all flex-shrink-0 self-start"
                onClick={() => handleRemoveItem([item.id])}
              >
                <XCircle size={20} />
              </button>
            </div>
          </div>
        );

      })}
    </div>
  );

  const renderOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl md:text-4xl bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-2 flex-shrink-0">
          {order.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-bold text-gray-800 truncate">{order.productName}</h3>
          <p className="text-xs text-gray-500 mt-1">{order.date} • {order.time}</p>
          <p className="text-xs text-gray-600 mt-1">{order.color}</p>
        </div>
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex-shrink-0 ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
          order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' :
            order.status === 'Chờ đánh giá' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
          }`}>
          {order.status}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-gray-600">
          <span>{order.items} sản phẩm</span>
          {order.eta && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {order.eta}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-lg font-bold text-purple-600">{formatPrice(order.total)}</span>
          <button className="text-purple-600 hover:text-purple-700 p-1 rounded-lg transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviewOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl md:text-4xl bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-2 flex-shrink-0">
          {order.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-bold text-gray-800 truncate">{order.productName}</h3>
          <p className="text-xs text-gray-500 mt-1">{order.date} • {order.time}</p>
          <p className="text-xs text-gray-600 mt-1">{order.color}</p>
        </div>
        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 whitespace-nowrap flex-shrink-0">
          {order.status}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-600">{order.items} sản phẩm</span>
        <span className="text-sm md:text-lg font-bold text-purple-600">{formatPrice(order.total)}</span>
      </div>

      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm">
        <Star size={16} />
        Đánh Giá Ngay
      </button>
    </div>
  );

  const renderCanceledOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl md:text-4xl bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-2 flex-shrink-0">
          {order.image}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-base font-bold text-gray-800 truncate">{order.productName}</h3>
          <p className="text-xs text-gray-500 mt-1">{order.date} • {order.time}</p>
          <p className="text-xs text-gray-600 mt-1">{order.color}</p>
        </div>
        <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap flex-shrink-0">
          {order.status}
        </span>
      </div>

      <div className="py-2 border-t border-gray-100">
        <p className="text-xs text-gray-600">Lý do: {order.reason}</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm md:text-lg font-bold text-gray-600">{formatPrice(order.total)}</span>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2 text-sm">
          <ShoppingCart size={16} />
          Mua Lại
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'cart':
        return renderCartContent();
      case 'shipping':
        return <div className="space-y-3">{shippingOrders.map(renderOrderCard)}</div>;
      case 'completed':
        return <div className="space-y-3">{completedOrders.map(renderOrderCard)}</div>;
      case 'review':
        return <div className="space-y-3">{reviewOrders.map(renderReviewOrderCard)}</div>;
      case 'canceled':
        return <div className="space-y-3">{canceledOrders.map(renderCanceledOrderCard)}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header - Compact for mobile */}
      <div className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 mb-3 md:mb-4">
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Đơn Hàng
            </h1>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg"
            >
              {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Search Bar */}
          <div className={`flex items-center gap-2 ${showMobileMenu ? 'block' : 'hidden md:flex'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 md:py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm"
              />
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 md:p-2.5 rounded-lg hover:shadow-lg transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Grid on mobile */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-1.5 rounded-lg">
                <TrendingUp size={16} />
              </div>
              <p className="text-xs text-gray-500">Tổng chi</p>
            </div>
            <p className="text-base md:text-xl font-bold text-gray-800">₫89.9M</p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-1.5 rounded-lg">
                <Package size={16} />
              </div>
              <p className="text-xs text-gray-500">Đơn hàng</p>
            </div>
            <p className="text-base md:text-xl font-bold text-gray-800">12</p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-1.5 rounded-lg">
                <CheckCircle size={16} />
              </div>
              <p className="text-xs text-gray-500">Hoàn thành</p>
            </div>
            <p className="text-base md:text-xl font-bold text-gray-800">8</p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-1.5 rounded-lg">
                <Star size={16} />
              </div>
              <p className="text-xs text-gray-500">Điểm</p>
            </div>
            <p className="text-base md:text-xl font-bold text-gray-800">2,450</p>
          </div>
        </div>
      </div>

      {/* Tabs - Horizontal scroll on mobile */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 mb-3 md:mb-4">
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-semibold transition-all whitespace-nowrap text-xs md:text-sm flex-shrink-0 ${isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/30' : 'bg-gray-200'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-6 pb-4">
        {renderContent()}
      </div>

      {/* Fixed Bottom Checkout (Cart only) - Mobile */}
      {activeTab === 'cart' && selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-bl from-purple-400 to-pink-300 border-t border-gray-200 shadow-2xl p-3 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex flex-col md:flex-row md:items-center gap-1">
              <p className="text-xs md:text-sm text-gray-600">
                {selectedItems.length} sản phẩm
              </p>
              <p className="text-lg md:text-xl font-bold text-purple-600">
                {formatPrice(calculateSelectedTotal())}
              </p>
            </div>
            <button
              disabled={selectedItems.length === 0}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:scale-105 hover:-translate-y-0.5 hover:brightness-110
                        ${selectedItems.length === 0
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'}
                      `}
              onClick={() => navigate(path.ORDER, { state: { selectedItemIds: selectedItems } })}
            >
              Thanh Toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;