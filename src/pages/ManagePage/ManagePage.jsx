import React, { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ShoppingCart,
  Users,
  CheckSquare,
  Check,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Tag,
  MessageSquare,
  ChevronDown,
  X,
  Layers,
  ClipboardList,
  Wrench,
  LogOut,
  ChevronRight,
  Star
} from 'lucide-react';

import ActionButton from '../../components/buttons/ActionButton';
import ProductModal from './ProductModal';
import CategoryModal from './CategoryModal';
import Notification from '../../components/Notification';
import SubmitButton from '../../components/buttons/SubmitButton';
import ConfirmationModal from '../../components/modals/ComfirmationModal';
import ControlButton from '../../components/buttons/ControlButton';

import useCommonStore from '../../store/useCommonStore';
import useAuthStore from '../../store/useAuthStore';

import CategoryService from '../../services/CategoryService';
import ProductService from '../../services/ProductService';

import { HttpStatusCode } from 'axios';
import authApi from '../../api/authApi';
import path from '../../utils/path';
const ManagePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout)

  const categories = useCommonStore((state) => state.categories);
  const setCategories = useCommonStore((state) => state.setCategories);
  const deleteCategory = useCommonStore((state) => state.deleteCategory);

  const currentUser = useAuthStore((state) => state.currentUser);

  const products = useCommonStore((state) => state.products);
  const setProducts = useCommonStore((state) => state.setProducts);
  const productStatuses = useCommonStore((state) => state.productStatuses);
  const setProductStatuses = useCommonStore((state) => state.setProductStatuses);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategoryId, setSearchCategoryId] = useState(null);
  const [searchProductStatus, setSearchProductStatus] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const [notification, setNotification] = useState({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
  const [confirmation, setConfirmation] = useState({ open: false, title: '', content: '', type: 'warning', onClose: () => { }, onConfirm: () => { }, loading: false });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [modalName, setModalName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const handleProductSelection = (productId) => {
    setSelectedProductIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleBulkCategoryChange = async (newCategoryId) => {
    try {
      await ProductService.changeProductsCategory(newCategoryId, selectedProductIds);

      setNotification({
        hide: false,
        title: 'Thành công',
        message: `Đã chuyển ${selectedProductIds.length} sản phẩm sang phân loại mới`,
        onClose: () => {
          setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
        },
        type: 'success'
      });

      setSelectedProductIds([]);
      setCategoryDropdownOpen(false);
      setIsSelectionMode(false);

      await fetchProducts();
      await fetchCategories();

    } catch (error) {
      setNotification({
        hide: false,
        title: 'Lỗi',
        message: 'Không thể chuyển phân loại sản phẩm',
        onClose: () => {
          setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
        },
        type: 'error'
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) {
      return;
    }
    setIsLoading(true);
    try {
      //call api
      await ProductService.deleteProducts(selectedProductIds);
      setNotification({
        hide: false,
        title: 'Thành công',
        message: `Đã xóa ${selectedProductIds.length} sản phẩm`,
        onClose: () => {
          setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
        },
        type: 'success'
      });
      fetchProducts();
      fetchCategories();
      setSelectedProductIds([]);
      setIsSelectionMode(false);

      // Refresh products list
      // await fetchProducts();
      setIsLoading(false);
      setConfirmation({ open: false, title: '', content: '', type: 'warning', onClose: () => { }, onConfirm: () => { }, loading: false });
    } catch (error) {
      setNotification({
        hide: false,
        title: 'Lỗi',
        message: error.response.data.message,
        onClose: () => {
          setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
        },
        type: 'error'
      });
      setIsLoading(false);
      setConfirmation({ open: false, title: '', content: '', type: 'warning', onClose: () => { }, onConfirm: () => { }, loading: false });
    }
  };
  const handleFindProducts = async () => {
    setIsLoading(true);
    try {
      const result = await ProductService.findProducts(searchQuery, searchCategoryId, searchProductStatus);
      if (result && result.status === HttpStatusCode.Ok) {
        setSearchResult(result.data);
      } else {
        setNotification({ hide: false, title: 'KHÔNG TÌM THẤY', message: result.data.message, onClose: () => { }, type: 'warning' })
        setSearchResult([]);
      }
      setSearchCategoryId(null);
      setSearchProductStatus(null);
      setIsLoading(false);
    } catch (error) {

      const errMsg = error.response?.data.message ? error.response.data.message : 'Lỗi'
      setNotification({ hide: false, title: 'TÌM KIẾM GẶP LỖI', message: errMsg, onClose: () => { }, type: 'error' });
      setSearchResult(null);
      setIsLoading(false);
    }

  }

  const handleDeleteProduct = async (productId) => {
    const result = await ProductService.deleteProduct(productId);
    if (result.status === HttpStatusCode.Ok) {
      setProducts(products.filter(p => p.id !== productId));
      setNotification({
        hide: false, title: 'Thành công', message: 'Xóa sản phẩm thành công.', type: 'success',
        onClose: () => {
          setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
        }
      });
    } else {
      setNotification({
        hide: false, title: 'Lỗi', message: 'Xóa sản phẩm thất bại. Vui lòng thử lại.', type: 'error',
        onClose: () => {
          setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
        }
      });
    }
  }

  useEffect(() => {
    if (!currentUser || !currentUser.role === 'ADMIN') {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setSearchResult(null)
    }
  }, [searchQuery]);

  const fetchCategories = async () => {
    const result = await CategoryService.getAllCategories();
    if (result && result.status === HttpStatusCode.Ok && Array.isArray(result.data)) {
      setCategories(result.data);
    }
  };
  useEffect(() => {
    try {

      if (!categories || categories.length === 0) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Lấy dánh sách phân loại gặp lỗi", error)
    }
  }, []);

  useEffect(() => {
    const fetchProductStatuses = async () => {
      try {
        const result = await ProductService.getAllProductStatuses();
        console.log("Fetch product statuses", result);
        console.log("result data", result.data);
        setProductStatuses(result.data)
      } catch (error) {
        console.error("Lấy danh sách trạng thái sản phẩm thất bại", error);
      }
    };

    fetchProductStatuses();
  }, []);

  const fetchProducts = async () => {
    const result = await ProductService.findProducts();
    if (result && result.status === HttpStatusCode.Ok && Array.isArray(result.data)) {
      setProducts(result.data);
    }
  };
  useEffect(() => {
    try {

      if (!products || products.length === 0) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Lấy dánh sách sản phẩm gặp lỗi", error)
    }
  }, []);

  // Mock data
  const stats = {
    totalProducts: 1247,
    totalOrders: 856,
    totalRevenue: 12500000,
    totalCustomers: 2341
  };

  const orders = [
    { id: '#001', customer: 'Nguyễn Văn A', total: 750000, status: 'completed', date: '2024-08-28' },
    { id: '#002', customer: 'Trần Thị B', total: 450000, status: 'pending', date: '2024-08-29' },
    { id: '#003', customer: 'Lê Văn C', total: 1200000, status: 'shipping', date: '2024-08-29' },
    { id: '#004', customer: 'Phạm Thị D', total: 320000, status: 'cancelled', date: '2024-08-27' }
  ];

  const customRequests = [
    { id: 1, customer: 'Mai Thị E', product: 'Áo thun in logo công ty', status: 'pending', priority: 'high' },
    { id: 2, customer: 'Hoàng Văn F', product: 'Quần áo đồng phục', status: 'in-progress', priority: 'medium' },
    { id: 3, customer: 'Vũ Thị G', product: 'Áo dài cưới', status: 'completed', priority: 'low' }
  ];

  const supportRequests = [
    { id: 1, customer: 'Đặng Văn H', issue: 'Sản phẩm bị lỗi', status: 'open', priority: 'urgent' },
    { id: 2, customer: 'Bùi Thị I', issue: 'Muốn đổi size', status: 'resolved', priority: 'low' },
    { id: 3, customer: 'Ngô Văn K', issue: 'Chậm giao hàng', status: 'pending', priority: 'medium' }
  ];


  const getStatusColor = (status) => {
    const colors = {
      'AVAILABLE': 'bg-green-100 text-green-800',
      'OUT_OF_STOCK': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'shipping': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800',
      'open': 'bg-red-100 text-red-800',
      'resolved': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'urgent': 'bg-red-100 text-red-800',
      'high': 'bg-orange-100 text-orange-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryNameById = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : 'Unknown';
  }

  const StatCard = ({ title, value, icon: Icon, change, color = "bg-green-50" }) => (
    <div className={`${color} backdrop-blur-sm border border-green-200/50 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-green-800 group-hover:text-green-900 transition-colors">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +{change}% so với tháng trước
            </p>
          )}
        </div>
        <div className="bg-green-200/50 p-3 rounded-xl group-hover:bg-green-300/50 transition-colors">
          <Icon className="w-6 h-6 text-green-600" />
        </div>
      </div>
    </div>
  );


  const TableRow = ({ children, className = '' }) => (
    <tr className={`hover:bg-green-50/50 transition-all duration-200 ${className}`}>
      {children}
    </tr>
  );

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Theo dõi tình trạng cửa hàng</h1>
          <p className="text-green-600">Đây là tổng quan hoạt động của cửa hàng hôm nay</p>
        </div>
        <ActionButton>
          <Plus className="w-4 h-4" />
          Thêm sản phẩm mới
        </ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng sản phẩm"
          value={stats.totalProducts}
          icon={Package}
          change={12}
        />
        <StatCard
          title="Đơn hàng"
          value={stats.totalOrders}
          icon={ShoppingCart}
          change={8}
          color="bg-blue-50"
        />
        <StatCard
          title="Doanh thu"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M đ`}
          icon={DollarSign}
          change={15}
          color="bg-purple-50"
        />
        <StatCard
          title="Khách hàng"
          value={stats.totalCustomers}
          icon={Users}
          change={5}
          color="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sản phẩm bán chạy
          </h3>
          <div className="space-y-3">
            {products.slice(0, 3).map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg hover:bg-green-100/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-green-800">{product.name}</p>
                    <p className="text-green-600 text-sm">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{product.price.toLocaleString()}đ</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Đơn hàng gần đây
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-green-50/30 rounded-lg hover:bg-green-50/60 transition-colors">
                <div>
                  <p className="font-medium text-green-800">{order.id}</p>
                  <p className="text-green-600 text-sm">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{order.total.toLocaleString()}đ</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'completed' ? 'Hoàn thành' :
                      order.status === 'pending' ? 'Chờ xử lý' :
                        order.status === 'shipping' ? 'Đang giao' : 'Đã hủy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Quản lý sản phẩm</h2>
          <p className="text-green-600">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
        </div>
        <div className="flex gap-2">
          {/* Select Mode Toggle */}
          <ActionButton
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (!isSelectionMode) {
                setSelectedProductIds([]);
              }
            }}
            variant={isSelectionMode ? "primary" : "secondary"}
            className={`${isSelectionMode ? 'bg-blue-500 text-white hover:bg-blue-600' : ''} transition-all duration-200`}
          >
            {isSelectionMode ? (
              <>
                <X className="w-4 h-4" />
                Hủy chọn
              </>
            ) : (
              <>
                <CheckSquare className="w-4 h-4" />
                Chọn
              </>
            )}
          </ActionButton>

          <ActionButton onClick={() => { setModalMode('add'); setSelectedProduct(null); setModalOpen(true); setModalName('product') }}>
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </ActionButton>
        </div>
      </div>

      {/* Selection Status Bar */}
      {isSelectionMode && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckSquare className="w-5 h-5" />
                <span className="font-medium">Chế độ chọn sản phẩm</span>
              </div>
              <div className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                {selectedProductIds.length} sản phẩm được chọn
              </div>
            </div>
            {selectedProductIds.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProductIds([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions Menu */}
      {selectedProductIds.length > 0 && isSelectionMode && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg animate-slide-up">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Hành động cho sản phẩm đã chọn</h3>
          <div className="flex flex-wrap gap-3">
            {/* Category Change Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
              >
                <Tag className="w-4 h-4" />
                Chuyển phân loại
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-sm text-gray-600 font-medium mb-2 px-2">Chọn phân loại mới:</div>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleBulkCategoryChange(category.id)}
                        className="w-full text-left px-3 py-2 hover:bg-green-50 rounded-lg transition-colors text-gray-700 hover:text-green-700"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {category.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bulk Delete */}
            <button
              onClick={() => {
                setConfirmation({
                  open: true, title: 'Thao tác nguy hiểm',
                  content: `Bạn có chắc muốn xóa ${selectedProductIds.length} sản phẩm`, type: 'warning',
                  onClose: () => { setConfirmation({ open: false, title: '', content: '', type: 'warning', onClose: () => { }, onConfirm: () => { }, loading: false }) },
                  onConfirm: () => { handleBulkDelete() },
                  loading: isLoading
                })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Xóa đã chọn ({selectedProductIds.length})
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-3 text-green-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
          />
        </div>
        <SubmitButton
          onClick={() => { handleFindProducts() }}
          label=""
          icon={Search}
          classname="bg-green-500 text-white hover:bg-green-600 h-12"
          loading={isLoading}
        />

        {/* Filter Dropdown */}
        <div className="relative"
          onMouseEnter={() => setIsFilterOpen(true)}
          onMouseLeave={() => {
            setIsFilterOpen(false);
            setActiveSubmenu(null);
          }}>
          <ActionButton
            variant="secondary"
            onMouseEnter={() => setIsFilterOpen(true)}
            onMouseLeave={() => {
              setTimeout(() => {
                if (!document.querySelector('.filter-dropdown:hover')) {
                  setIsFilterOpen(false);
                  setActiveSubmenu(null);
                }
              }, 900);
            }}
          >
            <Filter className="w-4 h-4" />
            Bộ lọc
          </ActionButton>

          {/* Filter Dropdown Menu */}
          {isFilterOpen && (
            <div className="filter-dropdown absolute top-full right-0 mt-1 w-56 bg-white border border-green-200 rounded-lg shadow-lg z-50">
              <div className='px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-green-100 flex items-center'
                onClick={() => { setSearchCategoryId(null); setSearchProductStatus(null); setSearchResult(null) }}>
                <p>Tất cả</p>
              </div>

              {/* Category Filter */}
              <div
                className="relative px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-green-100 flex items-center justify-between"
                onMouseEnter={() => setActiveSubmenu('category')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Lọc theo phân loại</span>
                </div>
                <ChevronRight className="w-4 h-4 text-green-400" />

                {activeSubmenu === 'category' && (
                  <div className="absolute right-full top-0 mr-1 w-48 bg-white border border-green-200 rounded-lg shadow-lg z-50">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-green-700 border-b border-green-50 last:border-b-0"
                        onClick={() => {
                          handleFindProducts()
                          setSearchCategoryId(category.id)
                          setIsFilterOpen(false);
                          setActiveSubmenu(null);
                        }}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div
                className="relative px-4 py-3 hover:bg-green-50 cursor-pointer flex items-center justify-between"
                onMouseEnter={() => setActiveSubmenu('status')}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-green-800 font-medium">Lọc theo trạng thái</span>
                </div>
                <ChevronRight className="w-4 h-4 text-green-400" />

                {activeSubmenu === 'status' && (
                  <div className="absolute right-full top-0 mr-1 w-48 bg-white border border-green-200 rounded-lg shadow-lg z-50">
                    {productStatuses.length !== 0 ? productStatuses.map((status) => (
                      <div
                        key={status.value}
                        className="px-4 py-2 hover:bg-green-50 cursor-pointer text-green-700 border-b border-green-50 last:border-b-0"
                        onClick={() => {
                          handleFindProducts()
                          setSearchProductStatus(status.value)
                          setIsFilterOpen(false);
                          setActiveSubmenu(null);
                        }}
                      >
                        {status.label}
                      </div>
                    )) : (
                      <div className='h-10'>Không có</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(searchResult ? searchResult : products).map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 cursor-pointer
               ${isSelectionMode
                ? 'hover:shadow-xl hover:-translate-y-1 hover:scale-105'
                : 'hover:shadow-xl hover:-translate-y-1 hover:scale-105'
              }
               ${selectedProductIds.includes(product.id)
                ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200'
                : 'border-green-100'
              }
               ${isSelectionMode ? 'hover:ring-2 hover:ring-blue-300' : ''}
            `}
            onClick={() => {
              if (isSelectionMode) {
                handleProductSelection(product.id);
              }
            }}
          >
            {/* Selection Checkbox */}
            {isSelectionMode && (
              <div className="absolute top-3 left-3 z-10">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${selectedProductIds.includes(product.id)
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}>
                  {selectedProductIds.includes(product.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              {product.images[0] ? (
                <img
                  src={product.images[0].secureUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-16 h-16 text-green-500" />
              )}

              {/* Status Badge */}
              <div className={`absolute top-3 right-3 ${isSelectionMode ? 'opacity-75' : ''}`}>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status === "AVAILABLE" ? "Đang bán" : "Hết hàng"}
                </span>
              </div>

              {/* Selection Overlay */}
              {isSelectionMode && selectedProductIds.includes(product.id) && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-lime-500 rounded-full flex items-center justify-center animate-pulse">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-gray-800 text-lg h-14 overflow-hidden">
                <span className="block truncate leading-7" title={product.name}>
                  {product.name}
                </span>
              </h3>

              {/* Category */}
              <p className="text-sm text-gray-500 h-5 overflow-hidden">
                <span className="block truncate" title={product.categoryId}>
                  {getCategoryNameById(product.categoryId)}
                </span>
              </p>

              {/* Price and Stock */}
              <div className="flex justify-between items-center h-6">
                <span className="font-bold text-green-700 text-lg">
                  {product.price.toLocaleString()}đ
                </span>
                <span
                  className={`text-sm font-medium ${product.quantity < 20 ? "text-red-600" : "text-gray-600"
                    }`}
                >
                  Kho: {product.quantity}
                </span>
              </div>

              {/* Action Buttons */}
              {!isSelectionMode && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    className="flex-1 p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalMode("view");
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalMode("edit");
                      setSelectedProduct(product);
                      setModalOpen(true);
                      setModalName('product');
                    }}
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="flex-1 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                    title="Xóa"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {modalName === 'product' ?
        (<ProductModal
          isOpen={modalOpen}
          mode={modalMode}
          product={selectedProduct}
          onClose={() => { setModalOpen(false); setModalName('') }}
          categories={categories}
          onSave={(result, error) => {
            if (error) {
              console.error("HAHHAHAHAH ERROR NÈ CON GÀ", error);
              const errorMessage = error.response?.data?.message || error.message || error || 'Lưu sản phẩm thất bại. Vui lòng thử lại.';
              setNotification({
                hide: false, title: 'LƯU THẤT BẠI', message: errorMessage,
                onClose: () => {
                  setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
                },
                type: 'error'
              });
            } else {
              if (modalMode === 'add') {
                setNotification({
                  hide: false,
                  title: 'Thành công',
                  message: 'Tạo sản phẩm thành công',
                  onClose: () => {
                    setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
                  },
                  type: 'success'
                });
              } else if (modalMode === 'edit') {
                setNotification({
                  hide: false,
                  title: 'Thành công',
                  message: 'Đã cập nhật thông tin sản phẩm',
                  onClose: () => {
                    setNotification({ hide: true, title: '', message: '', onClose: () => { }, type: 'info' });
                  },
                  type: 'success'
                });
              }
            }
          }}
        />) :
        <></>}
      {activeTab === 'products' ?
        (<ConfirmationModal
          isOpen={confirmation.open}
          title={confirmation.title}
          content={confirmation.content}
          type={confirmation.type}
          loading={confirmation.loading}
          onClose={confirmation.onClose}
          onConfirm={confirmation.onConfirm}
        />) :
        (<></>)}
    </div>
  );



  const renderCategories = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Phân loại sản phẩm</h2>
          <p className="text-green-600">Quản lý các danh mục sản phẩm</p>
        </div>
        <ActionButton onClick={() => { setModalName('category'); setModalOpen(true) }}>
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          let timer;

          const handleHoldStart = () => {
            timer = setTimeout(() => {
              setConfirmation({
                open: true,
                title: "Xác nhận xóa phân loại",
                content: `Bạn có chắc muốn xóa phân loại "${category.name}" không?`,
                type: "warning",
                loading: false,
                onClose: () =>
                  setConfirmation((prev) => ({ ...prev, open: false })),
                onConfirm: async () => {
                  setConfirmation((prev) => ({ ...prev, loading: true }));
                  try {
                    await deleteCategory(category.id);
                  } catch (err) {
                    console.error("Error deleting category:", err);
                  } finally {
                    setConfirmation((prev) => ({ ...prev, open: false, loading: false }));
                  }
                },
              });
            }, 1000); // Giữ 1s thì mở confirm
          };

          const handleHoldEnd = () => {
            clearTimeout(timer);
          };

          return (
            <div
              key={category.id}
              onClick={() => {
                setModalName("category");
                setSelectedCategory(category);
                setModalOpen(true);
              }}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              className={`border-2 border-green-200/50 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-4">
                <Layers className="w-8 h-8 text-green-600" />
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {category.products.length} Sản phẩm
                </span>
              </div>
              <h3 className="text-lg font-bold text-green-800 group-hover:text-green-900">
                {category.name}
              </h3>
              <p className="text-green-600 text-sm mt-1">
                {category.products.length} Sản phẩm
              </p>
            </div>
          );
        })}
      </div>

      {/* Modal update / create */}
      {modalName === "category" && (
        <CategoryModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalName("");
          }}
          category={selectedCategory}
          onSuccess={() => { }}
        />
      )}

      {/* Modal xác nhận */}
      {activeTab === "categories" && (
        <ConfirmationModal
          isOpen={confirmation.open}
          title={confirmation.title}
          content={confirmation.content}
          type={confirmation.type}
          loading={confirmation.loading}
          onClose={confirmation.onClose}
          onConfirm={confirmation.onConfirm}
        />
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Danh sách đơn hàng</h2>
          <p className="text-green-600">Quản lý tất cả đơn hàng</p>
        </div>
        <div className="flex gap-2">
          <ActionButton variant="secondary">
            <Filter className="w-4 h-4" />
            Lọc
          </ActionButton>
          <ActionButton>
            <Plus className="w-4 h-4" />
            Tạo đơn hàng
          </ActionButton>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50">
              <tr>
                <th className="text-left py-4 px-6 text-green-700 font-semibold">Mã đơn</th>
                <th className="text-left py-4 px-6 text-green-700 font-semibold">Khách hàng</th>
                <th className="text-left py-4 px-6 text-green-700 font-semibold">Tổng tiền</th>
                <th className="text-left py-4 px-6 text-green-700 font-semibold">Trạng thái</th>
                <th className="text-left py-4 px-6 text-green-700 font-semibold">Ngày đặt</th>
                <th className="text-left py-4 px-6 text-green-700 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <td className="py-4 px-6 font-mono font-bold text-green-700">{order.id}</td>
                  <td className="py-4 px-6 text-gray-700">{order.customer}</td>
                  <td className="py-4 px-6 font-semibold text-green-700">{order.total.toLocaleString()}đ</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'completed' ? 'Hoàn thành' :
                        order.status === 'pending' ? 'Chờ xử lý' :
                          order.status === 'shipping' ? 'Đang giao' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{order.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomOrders = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Yêu cầu đặt làm riêng</h2>
          <p className="text-green-600">Quản lý các yêu cầu sản xuất theo đặt hàng</p>
        </div>
        <ActionButton>
          <Plus className="w-4 h-4" />
          Tạo yêu cầu mới
        </ActionButton>
      </div>

      <div className="grid gap-4">
        {customRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">{request.product}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.priority)}`}>
                    {request.priority === 'high' ? 'Ưu tiên cao' :
                      request.priority === 'medium' ? 'Ưu tiên vừa' : 'Ưu tiên thấp'}
                  </span>
                </div>
                <p className="text-green-600 mb-3">Khách hàng: {request.customer}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status === 'pending' ? 'Chờ xử lý' :
                    request.status === 'in-progress' ? 'Đang thực hiện' : 'Hoàn thành'}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800">Hỗ trợ khách hàng</h2>
          <p className="text-green-600">Quản lý các yêu cầu hỗ trợ từ khách hàng</p>
        </div>
        <ActionButton>
          <Plus className="w-4 h-4" />
          Tạo ticket mới
        </ActionButton>
      </div>

      <div className="grid gap-4">
        {supportRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">{request.issue}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.priority)}`}>
                    {request.priority === 'urgent' ? 'Khẩn cấp' :
                      request.priority === 'high' ? 'Ưu tiên cao' :
                        request.priority === 'medium' ? 'Ưu tiên vừa' : 'Ưu tiên thấp'}
                  </span>
                </div>
                <p className="text-green-600 mb-3">Khách hàng: {request.customer}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status === 'open' ? 'Đang xử lý' :
                    request.status === 'pending' ? 'Chờ phản hồi' : 'Đã giải quyết'}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="p-6 h-screen overflow-auto">
      {/* Menu bên trái hoặc tabs */}

      <div className="flex gap-4 mb-6 bg-gray-200 h-10 space-x-4 rounded-md">
        <div className="flex items-center px-3 mr-2">
          <img
            src={currentUser.avatarUrl}
            alt="Logo"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
          />
        </div>
        <button onClick={() => setActiveTab("dashboard")} className={`rounded p-1 ${activeTab === 'dashboard' ? 'bg-lime-400' : ''}`}>Dashboard</button>
        <button onClick={() => setActiveTab("products")} className={`rounded p-1 ${activeTab === 'products' ? 'bg-lime-400' : ''}`}>Sản phẩm</button>
        <button onClick={() => setActiveTab("orders")} className={`rounded p-1 ${activeTab === 'orders' ? 'bg-lime-400' : ''}`}>Đơn hàng</button>
        <button onClick={() => setActiveTab("categories")} className={`rounded p-1 ${activeTab === 'categories' ? 'bg-lime-400' : ''}`}>Phân loại</button>
        <button onClick={() => setActiveTab("custom-orders")} className={`rounded p-1 ${activeTab === 'custom-orders' ? 'bg-lime-400' : ''}`}>Đặt riêng</button>
        <button onClick={() => setActiveTab("support")} className={`rounded p-1 ${activeTab === 'support' ? 'bg-lime-400' : ''}`}>Hỗ trợ</button>

        <ControlButton
          icon={LogOut}
          onClick={() => { logout(); authApi.logout(); navigate(path.HOME) }}
          label=""
          classname="ml-auto mr-4 bg-green-300 hover:bg-lime-400"
        />
      </div>

      {/* Render nội dung theo tab */}
      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "products" && renderProducts()}
      {activeTab === "orders" && renderOrders()}
      {activeTab === "categories" && renderCategories()}
      {activeTab === "custom-orders" && renderCustomOrders()}
      {activeTab === "support" && renderSupport()}

      <Notification
        hide={notification.hide}
        onClose={notification.onClose}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
};

export default ManagePage;