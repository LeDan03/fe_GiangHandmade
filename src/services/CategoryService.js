import CategoryApi from "../api/categoryApi";

const CategoryService = {
    async getAllCategories() {
        const response = await CategoryApi.getAllCategories();
        return response;
    }
}

export default CategoryService;