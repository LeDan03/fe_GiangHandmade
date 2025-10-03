import React, { useState } from 'react';
import { ShoppingCart, Package, XCircle, CheckCircle, Star, Clock, TrendingUp, Search, Filter, ChevronRight } from 'lucide-react';

import usePersonalStore from '../store/usePersonalStore';
import useCommonStore from '../store/useCommonStore';

const OrderManagementPage = () => {
  const [activeTab, setActiveTab] = useState('cart');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([1, 2]);
  const cart = usePersonalStore((state) => state.cart);
  const updateItem = usePersonalStore((state) => state.updateItem);
  const removeItem = usePersonalStore((state) => state.removeItem);
  const cartItems = cart?.items || [];

  const products = useCommonStore((state) => state.products);

  const handleGetProductById = (id) => {
    return products.find((p) => p.id === id);
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
    { id: 'shipping', name: 'Đang Vận Chuyển', icon: Package, count: shippingOrders.length, color: 'from-blue-500 to-cyan-500' },
    { id: 'completed', name: 'Đã Hoàn Thành', icon: CheckCircle, count: completedOrders.length, color: 'from-green-500 to-emerald-500' },
    { id: 'review', name: 'Chờ Đánh Giá', icon: Star, count: reviewOrders.length, color: 'from-yellow-500 to-orange-500' },
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
      .filter(item => selectedItems.includes(item.id))
      .reduce((sum, item) => {
        const product = handleGetProductById(item.productId);
        if (!product) return sum; // nếu chưa fetch ra product thì bỏ qua
        return sum + product.price * item.quantity;
      }, 0);
  };


  const renderCartContent = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
            onChange={toggleSelectAll}
            className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
          />
          <span className="font-semibold text-gray-700">
            Chọn tất cả ({selectedItems.length}/{cartItems.length} sản phẩm)
          </span>
        </label>
      </div>

      {cartItems.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        const product = handleGetProductById(item.productId) || {};
        // console.log("Product for cart item:", product);
        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${isSelected ? 'border-purple-500' : 'border-gray-100'
              }`}
          >
            <div className="flex items-center gap-6">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelectItem(item.id)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
              />

              <div className="text-6xl bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 flex items-center justify-center">
                <img src={product?.images[0]?.secureUrl || '../public/images/default-product-img.png'}
                  alt={item.name}
                  className="w-24 h-24 object-contain" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                {/* <p className="text-gray-500 mb-3">Phân loại: {product.}</p> */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                    <button className="text-gray-600 hover:text-purple-600 font-bold">-</button>
                    <span className="font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                    <button className="text-gray-600 hover:text-purple-600 font-bold">+</button>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatPrice(product?.price || 0)}
                  </span>

                </div>
              </div>

              <button className="text-red-500 hover:text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all">
                <XCircle size={24} />
              </button>
            </div>
          </div>
        );
      })}

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-medium">Đã chọn {selectedItems.length} sản phẩm</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Tổng thanh toán:</span>
          <span className="text-3xl font-bold">{formatPrice(calculateSelectedTotal())}</span>
        </div>
        <button
          disabled={selectedItems.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${selectedItems.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-white text-purple-600 hover:shadow-2xl hover:scale-105'
            }`}
        >
          {selectedItems.length === 0 ? 'Vui lòng chọn sản phẩm' : 'Thanh Toán Ngay'}
        </button>
      </div>
    </div>
  );

  const renderOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-purple-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-3">
            {order.image}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{order.productName}</h3>
            <p className="text-gray-500 text-sm mt-1">{order.date} • {order.time}</p>
            <p className="text-gray-600 text-sm mt-1">Màu: {order.color}</p>
          </div>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
          order.status === 'Đã hủy' ? 'bg-red-100 text-red-700' :
            order.status === 'Chờ đánh giá' ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-100 text-blue-700'
          }`}>
          {order.status}
        </span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex gap-6 text-sm text-gray-600">
          <span>{order.items} sản phẩm</span>
          {order.eta && <span className="flex items-center gap-1"><Clock size={16} /> {order.eta}</span>}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-purple-600">{formatPrice(order.total)}</span>
          <button className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-all group-hover:translate-x-1">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviewOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-yellow-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-3">
            {order.image}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{order.productName}</h3>
            <p className="text-gray-500 text-sm mt-1">{order.date} • {order.time}</p>
            <p className="text-gray-600 text-sm mt-1">Màu: {order.color}</p>
          </div>
        </div>
        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
          {order.status}
        </span>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
        <div className="flex gap-6 text-sm text-gray-600">
          <span>{order.items} sản phẩm</span>
        </div>
        <span className="text-xl font-bold text-purple-600">{formatPrice(order.total)}</span>
      </div>
      <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
        <Star size={20} />
        Đánh Giá Ngay
      </button>
    </div>
  );

  const renderCanceledOrderCard = (order) => (
    <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-red-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-gradient-to-br from-red-100 to-rose-100 rounded-xl p-3">
            {order.image}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{order.productName}</h3>
            <p className="text-gray-500 text-sm mt-1">{order.date} • {order.time}</p>
            <p className="text-gray-600 text-sm mt-1">Màu: {order.color}</p>
          </div>
        </div>
        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700">
          {order.status}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 mb-4">Lý do: {order.reason}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gray-600">{formatPrice(order.total)}</span>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2">
          <ShoppingCart size={20} />
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
        return <div className="space-y-4">{shippingOrders.map(renderOrderCard)}</div>;
      case 'completed':
        return <div className="space-y-4">{completedOrders.map(renderOrderCard)}</div>;
      case 'review':
        return <div className="space-y-4">{reviewOrders.map(renderReviewOrderCard)}</div>;
      case 'canceled':
        return <div className="space-y-4">{canceledOrders.map(renderCanceledOrderCard)}</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Quản Lý Đơn Hàng
              </h1>
              <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng của bạn</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                />
              </div>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl hover:shadow-lg transition-all hover:scale-105">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Tổng chi tiêu</p>
                <p className="text-xl font-bold text-gray-800">₫89.9M</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-3 rounded-xl">
                <Package size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Đơn hàng</p>
                <p className="text-xl font-bold text-gray-800">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-3 rounded-xl">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Hoàn thành</p>
                <p className="text-xl font-bold text-gray-800">8</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-3 rounded-xl">
                <Star size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Điểm thưởng</p>
                <p className="text-xl font-bold text-gray-800">2,450</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 overflow-x-auto">
          <div className="flex gap-2 min-w-max lg:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${isActive
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{tab.name}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-white/30' : 'bg-gray-200'
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default OrderManagementPage;