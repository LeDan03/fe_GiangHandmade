import axiosClient from "./axiosClient";

const CategoryApi = {
    getAllCategories: () => { return axiosClient.get("/categories") },
    createCategory: (categoryRequest) => { return axiosClient.post("/categories", categoryRequest) },
    updateCategory: (categoryId, categoryRequest) => { return axiosClient.put(`/categories/${categoryId}`, categoryRequest) },
    deleteCategory: (categoryId) => { return axiosClient.delete(`/categories/${categoryId}`) }
}

export default CategoryApi;