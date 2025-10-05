import React, { useState, useMemo, useEffect } from 'react';
import { CreditCard, Truck, ShoppingBag, ChevronRight, Check } from 'lucide-react';
import usePersonalStore from '../store/usePersonalStore.js';
import useCommonStore from '../store/useCommonStore';
import useAuthStore from '../store/useAuthStore';
import { useLocation, useNavigate } from 'react-router-dom';
import path from '../utils/path.js';

const OrderPage = () => {
    const navigate = useNavigate();

    const currentUser = useAuthStore(state => state.currentUser);
    const products = useCommonStore(state => state.products);
    const cartItems = usePersonalStore(state => state.cart.items);
    const [selectedPayment, setSelectedPayment] = useState('cod');
    const [orderNote, setOrderNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate(path.LOGIN);
        }
    }, []);

    const { state } = useLocation();
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        console.log('Selected item ids', state.selectedItemIds)
        if (state?.selectedItemIds) {
            const selected = cartItems.filter(item => state.selectedItemIds.includes(item.id));
            setSelectedItems(selected);
        } else {
            navigate(path.HOME);
        }
    }, []);

    const paymentMethods = [
        {
            id: 'cod',
            name: 'Thanh toán khi nhận hàng',
            description: 'Thanh toán bằng tiền mặt khi nhận hàng',
            icon: Truck,
            badge: 'Phổ biến'
        },
        {
            id: 'vnpay',
            name: 'Thanh toán qua VNPay',
            description: 'Thanh toán trực tuyến qua cổng VNPay',
            icon: CreditCard,
            badge: 'Nhanh chóng'
        }
    ];

    const enrichedCartItems = useMemo(() => {
        return selectedItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            return { ...item, product };
        });
    }, [selectedItems, products]);

    const subtotal = useMemo(() => {
        return enrichedCartItems.reduce((sum, item) =>
            item.priceSnapshot, 0
        );
    }, [enrichedCartItems]);

    const shippingFee = 30000;
    const total = subtotal + shippingFee;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleCheckout = () => {
        setIsProcessing(true);
        setTimeout(() => {
            alert(`Đặt hàng thành công!\nPhương thức: ${paymentMethods?.find(p => p.id === selectedPayment).name}\nTổng tiền: ${formatCurrency(total)}`);
            setIsProcessing(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800">Thanh toán</h1>
                            <p className="text-sm text-slate-500">{enrichedCartItems.length} sản phẩm</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Cart Items & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cart Items */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 lg:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                                <h2 className="font-semibold text-slate-800 text-lg">Sản phẩm đã chọn</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {enrichedCartItems?.map((item) => (
                                    <div key={item.id} className="p-4 lg:p-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 ring-1 ring-slate-200">
                                                <img
                                                    src={item.product?.images?.[0]?.secureUrl || '/images/default-product-img.png'}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-800 mb-1 truncate">
                                                    {item.product?.name || 'Sản phẩm không tồn tại'}
                                                </h3>
                                                <p className="text-sm text-slate-500 mb-2 line-clamp-1">
                                                    {item.product?.description}
                                                </p>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="px-3 py-1 bg-slate-100 rounded-lg text-sm text-slate-600">
                                                        SL: {item.quantity}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-blue-600">
                                                            {formatCurrency(item.priceSnapshot)}
                                                        </p>
                                                        {item.quantity > 1 && (
                                                            <p className="text-xs text-slate-500">
                                                                {formatCurrency(item.product.price)} / sp
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 lg:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                                <h2 className="font-semibold text-slate-800 text-lg">Phương thức thanh toán</h2>
                            </div>
                            <div className="p-4 lg:p-6 space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon;
                                    const isSelected = selectedPayment === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left group hover:scale-[1.02] ${isSelected
                                                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                                                : 'border-slate-200 hover:border-blue-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isSelected
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                    }`}>
                                                    {isSelected ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                                                            {method.name}
                                                        </h3>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isSelected
                                                            ? 'bg-blue-200 text-blue-800'
                                                            : 'bg-slate-200 text-slate-600'
                                                            }`}>
                                                            {method.badge}
                                                        </span>
                                                    </div>
                                                    <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                                                        {method.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Note */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 lg:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-transparent">
                                <h2 className="font-semibold text-slate-800 text-lg">Ghi chú đơn hàng</h2>
                            </div>
                            <div className="p-4 lg:p-6">
                                <textarea
                                    value={orderNote}
                                    onChange={(e) => setOrderNote(e.target.value)}
                                    placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors resize-none text-slate-700 placeholder:text-slate-400"
                                    rows="4"
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao, v.v.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden lg:sticky lg:top-24">
                            <div className="p-4 lg:p-6 border-b border-slate-100 bg-gradient-to-br from-blue-50 to-indigo-50">
                                <h2 className="font-semibold text-slate-800 text-lg">Tóm tắt đơn hàng</h2>
                            </div>
                            <div className="p-4 lg:p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tạm tính</span>
                                        <span className="font-medium">{formatCurrency(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Phí vận chuyển</span>
                                        <span className="font-medium">{formatCurrency(shippingFee)}</span>
                                    </div>
                                </div>

                                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-slate-800">Tổng cộng</span>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(total)}</p>
                                        <p className="text-xs text-slate-500">Đã bao gồm VAT</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Đặt hàng ngay</span>
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>

                                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold text-emerald-900 mb-1">Đảm bảo an toàn</p>
                                            <p className="text-emerald-700">Hoàn tiền 100% nếu có vấn đề với đơn hàng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;