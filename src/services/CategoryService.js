import CategoryApi from "../api/categoryApi";

const CategoryService = {
    async getAllCategories() {
        const response = await CategoryApi.getAllCategories();
        return response;
    },
    async createCategory(categoryRequest) {
        return await CategoryApi.createCategory(categoryRequest);
    },
    async updateCategory(id, categoryRequest) {
        return await CategoryApi.updateCategory(id, categoryRequest);
    },
    async deleteCategory(categoryId) {
        return await CategoryApi.deleteCategory(categoryId);
    }
}

export default CategoryService;