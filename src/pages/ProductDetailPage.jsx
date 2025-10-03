import React, { useEffect, useState } from 'react';
import { ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight, Package, Shield, Truck, Upload, X, Send, ChevronDown, ChevronUp, Leaf } from 'lucide-react';

import ActionButton from "../components/buttons/ActionButton.jsx";
import Notification from '../components/Notification.jsx';

import { useParams, useNavigate } from 'react-router-dom';

import useCommonStore from '../store/useCommonStore';
import useAuthStore from '../store/useAuthStore';
import usePersonalStore from '../store/usePersonalStore.js';

import CloudinaryService from '../services/CloudinaryService.js';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    // Review states
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibleReviews, setVisibleReviews] = useState(3);

    const product = useCommonStore(state => state.products.find(p => p.id === Number(id))) || null;
    const currentUser = useAuthStore(state => state.currentUser);

    const addItem = usePersonalStore(state => state.addItem);

    const [notification, setNotification] = useState({ hide: true, title: '', message: '', onClose: {}, type: "info" });

    const [reviews, setReviews] = useState([
        {
            id: 1,
            userName: "Nguyễn Văn A",
            userAvatar: "https://i.pravatar.cc/150?img=1",
            rating: 5,
            content: "Sản phẩm rất đẹp và chất lượng, đóng gói cẩn thận. Mình rất hài lòng với lần mua hàng này!",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-28T10:30:00Z",
            orderId: "ORD-12345"
        },
        {
            id: 2,
            userName: "Trần Thị B",
            userAvatar: "https://i.pravatar.cc/150?img=5",
            rating: 5,
            content: "Giao hàng nhanh, sản phẩm đúng như mô tả. Sẽ ủng hộ shop lần sau.",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-25T14:20:00Z",
            orderId: "ORD-12346"
        },
        {
            id: 3,
            userName: "Lê Văn C",
            userAvatar: "https://i.pravatar.cc/150?img=3",
            rating: 4,
            content: "Sản phẩm đẹp, nhưng giao hơi lâu. Nhìn chung vẫn ổn.",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-20T09:15:00Z",
            orderId: "ORD-12347"
        },
        {
            id: 4,
            userName: "Phạm Thị D",
            userAvatar: "https://i.pravatar.cc/150?img=9",
            rating: 5,
            content: "Chất lượng tuyệt vời, đúng như mô tả!",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-18T08:15:00Z",
            orderId: "ORD-12349"
        },
        {
            id: 5,
            userName: "Hoàng Văn E",
            userAvatar: "https://i.pravatar.cc/150?img=12",
            rating: 4,
            content: "Sản phẩm tốt, giao hàng đúng hẹn.",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-15T16:45:00Z",
            orderId: "ORD-12350"
        },
        {
            id: 6,
            userName: "Đỗ Thị F",
            userAvatar: "https://i.pravatar.cc/150?img=20",
            rating: 5,
            content: "Rất đẹp và độc đáo, phù hợp làm quà tặng!",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-12T11:20:00Z",
            orderId: "ORD-12351"
        },
        {
            id: 7,
            userName: "Vũ Văn G",
            userAvatar: "https://i.pravatar.cc/150?img=15",
            rating: 5,
            content: "Sản phẩm handmade chất lượng cao, rất hài lòng!",
            image: null,
            productName: "Handmade Ceramic Vase - Sunset Collection",
            createdAt: "2024-09-10T14:30:00Z",
            orderId: "ORD-12352"
        }
    ]);

    const [hasReviewed, setHasReviewed] = useState(false);
    const [userOrder, setUserOrder] = useState(null);

    // Similar products
    const similarProducts = [
        {
            id: 2,
            name: "Handmade Clay Pot",
            price: 320000,
            image: "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=400&h=400&fit=crop",
            rating: 5,
            soldCount: 45
        },
        {
            id: 3,
            name: "Ceramic Bowl Set",
            price: 580000,
            image: "https://images.unsplash.com/photo-1587742119668-4120bb8a9ecd?w=400&h=400&fit=crop",
            rating: 4,
            soldCount: 62
        },
        {
            id: 4,
            name: "Decorative Plate",
            price: 280000,
            image: "https://images.unsplash.com/photo-1604868585928-de1ec1bd3189?w=400&h=400&fit=crop",
            rating: 5,
            soldCount: 38
        },
        {
            id: 5,
            name: "Artisan Mug",
            price: 195000,
            image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
            rating: 5,
            soldCount: 91
        }
    ];

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        // Giả lập check đơn hàng đã mua - Thay bằng API call thật
        const mockUserOrder = {
            orderId: "ORD-12353",
            productName: product?.name,
            purchaseDate: "2024-09-30T10:00:00Z"
        };
        setUserOrder(mockUserOrder);

        // Check if user already reviewed this order
        const existingReview = reviews.find(r => r.orderId === mockUserOrder.orderId);
        setHasReviewed(!!existingReview);
    }, [currentUser, product]);

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} tháng trước`;
        return `${Math.floor(diffInSeconds / 31536000)} năm trước`;
    };

    const nextImage = () => {
        if (product?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = () => {
        if (product?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handleAddToCart = () => {
        addItem({ cartId:currentUser.cartId, productId: id, quantity });
        setNotification({ hide: false, title: 'Thành công', message: 'Đã thêm vào giỏ hàng', type: 'success' });
    };

    const handleBuyNow = () => {
        alert(`Mua ngay ${quantity} sản phẩm!`);
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (reviewImages.length + files.length > 3) {
            alert('Chỉ được tải lên tối đa 3 ảnh');
            return;
        }

        setIsSubmitting(true);
        try {
            const uploadPromises = files.map(file => CloudinaryService.uploadImage(file));
            const uploadedImages = await Promise.all(uploadPromises);
            setReviewImages([...reviewImages, ...uploadedImages.map(img => img.secureUrl)]);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Tải ảnh thất bại. Vui lòng thử lại.');
        }
        setIsSubmitting(false);
    };

    const removeImage = (index) => {
        setReviewImages(reviewImages.filter((_, i) => i !== index));
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }
        if (reviewContent.trim().length < 10) {
            alert('Nội dung đánh giá phải có ít nhất 10 ký tự');
            return;
        }
        if (reviewContent.length > 500) {
            alert('Nội dung đánh giá không được vượt quá 500 ký tự');
            return;
        }

        setIsSubmitting(true);
        try {
            const newReview = {
                id: reviews.length + 1,
                userName: currentUser?.name || 'User',
                userAvatar: currentUser?.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
                rating: rating,
                content: reviewContent,
                image: reviewImages[0] || null,
                productName: userOrder.productName,
                createdAt: new Date().toISOString(),
                orderId: userOrder.orderId
            };

            setReviews([newReview, ...reviews]);
            setHasReviewed(true);

            setRating(0);
            setReviewContent('');
            setReviewImages([]);

            alert('Đánh giá thành công!');
        } catch (error) {
            console.error('Submit review failed:', error);
            alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
        }
        setIsSubmitting(false);
    };

    const loadMoreReviews = () => {
        setVisibleReviews(prev => Math.min(prev + 10, reviews.length));
    };
    const collapseReviews = () => {
        setVisibleReviews(3);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12">
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group">
                                <img
                                    src={product?.images?.[currentImageIndex]?.secureUrl || '/public/images/default-product-img.png'}
                                    alt={product?.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {product?.images?.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronLeft className="w-6 h-6 text-gray-700" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                        >
                                            <ChevronRight className="w-6 h-6 text-gray-700" />
                                        </button>
                                    </>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button
                                        onClick={() => setIsFavorite(!isFavorite)}
                                        className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                    >
                                        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                                    </button>
                                    <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all">
                                        <Share2 className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Navigation */}
                            <div className="flex gap-3 justify-center">
                                {product?.images?.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? 'border-green-500 shadow-lg' : 'border-gray-200 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img.secureUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col">
                            <div className="flex-1">
                                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
                                    Handmade
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                                    {product?.name}
                                </h1>

                                <div className="flex items-center gap-4 mb-6 flex-wrap">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < product?.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-600 font-medium">{product?.rating}.0</span>
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-600">{reviews.length} đánh giá</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-gray-600">{product?.soldCount} đã bán</span>
                                </div>

                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-6">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">
                                        {formatPrice(product?.price)}
                                    </div>
                                    <div className="text-sm text-gray-600">Còn lại: {product?.quantity} sản phẩm</div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h3>
                                    <p className="text-gray-600 leading-relaxed">{product?.description}</p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="flex flex-col items-center text-center p-3 bg-green-50 rounded-xl">
                                        <Package className="w-6 h-6 text-green-600 mb-2" />
                                        <span className="text-xs text-gray-600">Đóng gói cẩn thận</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-3 bg-blue-50 rounded-xl">
                                        <Leaf className="w-6 h-6 text-blue-600 mb-2" />
                                        <span className="text-xs text-gray-600">Chất liệu an toàn</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-3 bg-orange-50 rounded-xl">
                                        <Truck className="w-6 h-6 text-orange-600 mb-2" />
                                        <span className="text-xs text-gray-600">Giao hàng nhanh</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="border-t pt-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="font-medium text-gray-700">Số lượng:</span>
                                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="px-6 py-2 font-medium">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <ActionButton variant="secondary" onClick={handleAddToCart} className="flex-1 justify-center">
                                        <ShoppingCart className="w-5 h-5" />
                                        Thêm vào giỏ
                                    </ActionButton>
                                    <ActionButton variant="primary" onClick={handleBuyNow} className="flex-1 justify-center">
                                        <p>{product.quantity > 0 ? "Mua ngay" : "Đặt hàng"}</p>
                                    </ActionButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 p-6 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                        Đánh giá sản phẩm ({reviews.length})
                    </h2>

                    {/* Write Review Form */}
                    {userOrder && !hasReviewed && (
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={currentUser?.avatar.secureUrl}
                                    alt={currentUser?.name}
                                    loading="lazy"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{currentUser?.name || 'User'}</p>
                                    <p className="text-sm text-gray-600">Đơn hàng: {userOrder.productName}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đánh giá của bạn <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung đánh giá <span className="text-red-500">*</span>
                                    <span className="text-xs text-gray-500 ml-2">({reviewContent.length}/500 ký tự)</span>
                                </label>
                                <textarea
                                    value={reviewContent}
                                    onChange={(e) => setReviewContent(e.target.value)}
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thêm ảnh (Tối đa 3 ảnh)
                                </label>
                                <div className="flex gap-3 flex-wrap">
                                    {reviewImages.map((img, idx) => (
                                        <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden">
                                            <img src={img} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {reviewImages.length < 3 && (
                                        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors">
                                            <Upload className="w-6 h-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-1">Tải ảnh</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <ActionButton
                                variant="primary"
                                onClick={handleSubmitReview}
                                disabled={isSubmitting}
                                className="w-full justify-center"
                            >
                                {isSubmitting ? (
                                    <>Đang gửi...</>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Gửi đánh giá
                                    </>
                                )}
                            </ActionButton>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Chưa có đánh giá nào</p>
                        ) : (
                            <>
                                {reviews.slice(0, visibleReviews).map((review) => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={review.userAvatar}
                                                alt={review.userName}
                                                loading="lazy"
                                                className="w-12 h-12 rounded-full flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2 gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800">{review.userName}</p>
                                                        <p className="text-sm text-gray-500 truncate">Đã mua: {review.productName}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-400 whitespace-nowrap">
                                                        {getTimeAgo(review.createdAt)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1 mb-3">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>

                                                <p className="text-gray-700 mb-3 leading-relaxed break-words">
                                                    {review.content}
                                                </p>

                                                {review.image && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={review.image}
                                                            alt="Review"
                                                            className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                {visibleReviews < reviews.length && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={loadMoreReviews}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-700 font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                            Xem thêm {Math.min(10, reviews.length - visibleReviews)} đánh giá
                                        </button>
                                    </div>
                                )}
                                {visibleReviews > 3 && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={collapseReviews}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-700 font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <ChevronUp className="w-5 h-5" />
                                            Thu gọn
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Similar Products */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sản phẩm tương tự</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {similarProducts.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                            >
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-orange-600">
                                            {formatPrice(item.price)}
                                        </span>
                                        <span className="text-xs text-gray-500">{item.soldCount} đã bán</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Notification
                hide={notification.hide}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ ...notification, hide: true })}
            />
        </div>
    );
};

export default ProductDetailPage;