import axiosClient from "./axiosClient";

const CategoryApi = {
    getAllCategories: () => { return axiosClient.get("/categories") }
}

export default CategoryApi;