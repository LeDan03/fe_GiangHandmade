import { useState, useEffect } from "react";
import { Save, X, Upload, Loader2 } from "lucide-react";
import { HttpStatusCode } from "axios";

import BaseModal from "../../components/modals/BaseModal";

import ProductService from "../../services/ProductService";
import CloudinaryService from "../../services/CloudinaryService";
import useCommonStore from "../../store/useCommonStore";

import Decimal from "decimal.js";
import validators from "../../utils/validators";

const ProductModal = ({
  isOpen,
  onClose,
  mode = "view", // 'view' | 'edit' | 'add'
  product = null,
  categories = [],
  onSave = () => { },
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  });

  const products = useCommonStore((state) => state.products);
  const setProducts = useCommonStore((state) => state.setProducts);

  const [imageFiles, setImageFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Thêm loading state

  // Khi modal mở ra → set dữ liệu vào form
  useEffect(() => {
    if (product && (mode === "view" || mode === "edit")) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "",
        categoryId: product.categoryId || "",
        images: product.images || [],
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        images: [],
      });
    }
    setImageFiles([]);
    setIsLoading(false); // Reset loading khi mở modal
  }, [product, mode, isOpen]);

  const isReadOnly = mode === "view";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index, type = "new") => {
    if (type === "new") {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const isSuccess = (res) =>
    [HttpStatusCode.Created, HttpStatusCode.Ok].includes(res?.status);

  const handleSave = async () => {
    if (mode === "view" || isLoading) return; // Ngăn không cho click khi đang loading
    
    const imageCount = formData.images.length + imageFiles.length;

    if (!validators.isValidProductImageCount(imageCount)) {
      const errorMsg = "Chỉ có thể chọn tối đa 3 ảnh cho 1 sản phẩm";
      // Ném lỗi về Parent qua onSave
      if (onSave) onSave(null, errorMsg);
      return;
    }

    const priceDecimal = new Decimal(formData.price || 0);
    const saveData = {
      ...formData,
      price: priceDecimal.toString(), // backend nhận string → BigDecimal
      quantity: Number.parseInt(formData.quantity ?? 0),
      categoryId: Number.parseInt(formData.categoryId ?? 0),
    };

    setIsLoading(true); // Bắt đầu loading

    try {
      const result =
        mode === "add"
          ? await handleCreateProduct(saveData)
          : await handleUpdateProduct(product?.id, saveData);

      if (isSuccess(result)) {
        onSave(result, null);
        onClose();
      } else {
        // Nếu không thành công, chủ động throw để catch phía dưới xử lý
        const err = new Error("Lưu sản phẩm thất bại");
        err.response = result;
        throw err;
      }
    } catch (error) {
      console.error("Lưu sản phẩm thất bại:", error);
      onSave(null, error); // parent chắc chắn nhận error
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleCreateProduct = async (saveData) => {
    // Upload ảnh: nếu lỗi → throw để handleSave bắt
    if (imageFiles.length > 0) {
      try {
        const uploadResults = await Promise.all(
          imageFiles.map((file) => CloudinaryService.uploadImage(file))
        );
        const uploadedImageDtos = uploadResults
          .filter(Boolean)
          .filter((res) => res.secureUrl);
        saveData.images = uploadedImageDtos;
      } catch (error) {
        console.error("Lỗi khi post ảnh lên Cloudinary", error);
        throw error;
      }
    }

    // Gọi API: nếu axios reject → throw ra ngoài cho handleSave
    const res = await ProductService.createProduct(saveData);
    if (res?.status === HttpStatusCode.Created) {
      setProducts([res.data, ...products]);
    }
    return res;
  };

  const handleUpdateProduct = async (id, saveData) => {
    if (!id) throw new Error("Thiếu id sản phẩm để cập nhật");

    if (imageFiles.length > 0) {
      try {
        const uploadResults = await Promise.all(
          imageFiles.map((file) => CloudinaryService.uploadImage(file))
        );
        const uploadedImageDtos = uploadResults
          .filter(Boolean)
          .filter((res) => res.secureUrl);

        // Gộp + khử trùng lặp theo publicId (tuỳ chọn)
        const existing = formData.images ?? [];
        const merged = [...existing, ...uploadedImageDtos];
        const dedup = Array.from(
          new Map(merged.map((i) => [i.publicId, i])).values()
        );
        saveData.images = dedup;
      } catch (error) {
        console.error("Lỗi upload ảnh khi update", error);
        throw error; // bong bóng lỗi ra ngoài
      }
    }

    const res = await ProductService.updateProduct(id, saveData);
    if (res?.status === HttpStatusCode.Ok) {
      setProducts(products.map((p) => (p.id === id ? res.data : p)));
    }
    return res;
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Thêm sản phẩm mới";
      case "edit":
        return "Chỉnh sửa sản phẩm";
      case "view":
        return "Chi tiết sản phẩm";
      default:
        return "";
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={getTitle()} 
      maxWidth="max-w-6xl"
      closeOnBackdrop={!isLoading} // Không cho đóng modal khi đang loading
    >
      <div className="flex gap-8 max-h-[500px] overflow-auto">
        {/* Cột trái - Hình ảnh */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Hình ảnh sản phẩm
          </label>
          
          <div className="border rounded-lg p-4 bg-gray-50 h-full min-h-[550px]">
            {/* Ảnh đã có */}
            {formData.images.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Ảnh hiện tại</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <img
                        src={img.secureUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {!isReadOnly && !isLoading && (
                        <button
                          onClick={() => handleRemoveImage(index, "old")}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ảnh mới upload */}
            {imageFiles.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Ảnh mới thêm</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {!isReadOnly && !isLoading && (
                        <button
                          onClick={() => handleRemoveImage(index, "new")}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors shadow-lg"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload area */}
            {!isReadOnly && !isLoading && (
              <div className={`${(formData.images.length > 0 || imageFiles.length > 0) ? 'mt-auto' : 'h-full flex items-center justify-center'}`}>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-3" />
                  <span className="text-sm font-medium text-gray-600 mb-1">
                    Chọn hoặc kéo thả ảnh
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG, GIF tối đa 10MB
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Loading overlay cho phần upload */}
            {!isReadOnly && isLoading && (
              <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200">
                <div className="text-center text-gray-500">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <span className="text-sm">Đang xử lý...</span>
                </div>
              </div>
            )}

            {/* Trường hợp không có ảnh nào trong view mode */}
            {isReadOnly && formData.images.length === 0 && imageFiles.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span className="text-sm">Chưa có hình ảnh</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải - Thông tin sản phẩm */}
        <div className="flex-1">
          <div className="space-y-6">
            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={isReadOnly || isLoading}
                className={`${mode === 'view' || isLoading ? 'bg-gray-100' : 'bg-white'} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors`}
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                readOnly={isReadOnly || isLoading}
                rows={4}
                className={`${mode === 'view' || isLoading ? 'bg-gray-100' : 'bg-white'} w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors resize-none`}
                placeholder="Nhập mô tả sản phẩm"
              />
            </div>

            {/* Giá & Số lượng */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    readOnly={isReadOnly || isLoading}
                    className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors ${mode === 'view' || isLoading ? 'bg-gray-100' : 'bg-white'}`}
                    placeholder="0"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    VNĐ
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  readOnly={isReadOnly || isLoading}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors ${mode === 'view' || isLoading ? 'bg-gray-100' : 'bg-white'}`}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isReadOnly || isLoading}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-colors ${mode === 'view' || isLoading ? 'bg-gray-100' : 'bg-white'}`}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Thông tin bổ sung */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Lưu ý</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Tên sản phẩm nên rõ ràng và dễ hiểu</li>
                <li>• Hình ảnh nên có chất lượng tốt để thu hút khách hàng</li>
                <li>• Mô tả chi tiết giúp khách hàng hiểu rõ sản phẩm</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {!isReadOnly && <span className="text-red-500">*</span>} Trường bắt buộc
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg transition-colors ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            {isReadOnly ? "Đóng" : "Hủy"}
          </button>

          {!isReadOnly && (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`px-6 py-2.5 bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 shadow-sm ${
                isLoading 
                  ? 'opacity-75 cursor-not-allowed' 
                  : 'hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Chờ Đan tí nha...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {mode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ProductModal;