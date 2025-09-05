import productApi from "../api/productApi";

const ProductService = {
    findProducts: async (keyword, categoryId, productStatus) => {
        try {
            const response = await productApi.findProducts(keyword, categoryId, productStatus);
            return response;
        } catch (error) {
            console.warn("Lấy danh sách sản phẩm thất bại", error);
        }
    },
    getProductById: async (id) => {
        try {
            const response = await productApi.getProductById(id);
            return response;
        }
        catch (error) {
            console.warn(`Lấy thông tin sản phẩm với id ${id} thất bại:`, error);
        }
    },
    createProduct: async (data) => {

        try {
            const response = await productApi.createProduct(data);
            return response;
        }
        catch (error) {
            console.warn("Tạo sản phẩm mới thất bại", error);
        }
    },
    updateProduct: async (id, data) => {
        try {
            const response = await productApi.updateProduct(id, data);
            return response;
        }
        catch (error) {
            console.warn(`Cập nhật sản phẩm có id ${id} thất bại:`, error);
        }
    },
    deleteProduct: async (id) => {
        try {
            const response = await productApi.deleteProduct(id);
            return response;
        }
        catch (error) {
            console.warn(`Xóa sản phẩm với id: ${id} thất bại:`, error);
        }
    },
    deleteProducts: async (ids) => {
        try {
            const response = await productApi.deleteProducts(ids);
            console.log("Delete products result", response);
            return response;
        } catch (error) {
            console.warn("Xóa danh sách sản phẩm được chọn thất bại", error);
            return error;
        }
    }
    ,
    getAllProductStatuses: async () => {
        try {
            const response = await productApi.getAllProductStatuses();
            return response;
        } catch (error) {
            console.warn("Lấy map trạng thái sản phẩm thất bại", error);
            return error;
        }
    },
    changeProductsCategory: async (categoryId, productIds) => {
        try {
            const response = await productApi.changeProductsCategory(categoryId, productIds);
            return response;
        } catch (error) {
            console.warn("Lỗi khi thay đổi phân loại cho danh sách sản phẩm", error);
            return error;
        }
    }
};
export default ProductService;