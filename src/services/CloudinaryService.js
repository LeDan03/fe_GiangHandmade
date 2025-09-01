import axios from "axios";

const CloudinaryService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Giang Handmade");
        formData.append("cloud_name", "dkmql9swy"); // Thay 'your_folder_name' bằng tên thư mục bạn muốn lưu trữ ảnh 
        try {
            const response = await axios.post( 
                'https://api.cloudinary.com/v1_1/dkmql9swy/image/upload',
                formData
            );
            return { "secureUrl": response.data.secure_url, "publicId": response.data.public_id };
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
};
export default CloudinaryService;