import axiosClient from "./axiosClient";

const productApi = {
    findProducts: (keyword, categoryId, productStatus) => {
        return axiosClient.get("/products", {
            params: {
                keyword: keyword || null,
                categoryId: categoryId || null,
                productStatus: productStatus || null,
            },
        });
    },
    getProductById: (id) => { return axiosClient.get(`/products/${id}`) },
    createProduct: (data) => { return axiosClient.post('/products', data) },
    updateProduct: (id, data) => { return axiosClient.put(`/products?productId=${id}`, data) },
    deleteProduct: (id) => { return axiosClient.delete(`/products?productId=${id}`) },
};

export default productApi;