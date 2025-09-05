import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import BaseModal from "../../components/modals/BaseModal";
import useCommonStore from "../../store/useCommonStore";

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
  isLoading: externalLoading, // optional: nếu cha muốn điều khiển loading
}) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Lấy actions từ store
  const { createCategory, updateCategory } = useCommonStore();

  // Khi mở modal update thì load dữ liệu
  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
      });
    } else {
      setForm({ name: "", description: "" });
    }
  }, [category]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (category) {
        await updateCategory(category.id, form);
      } else {
        await createCategory(form);
      }
      onSuccess?.(); // callback reload list
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  // ưu tiên loading từ cha truyền vào, nếu có
  const isBusy = externalLoading ?? loading;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="w-[400px] p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {category ? "Cập nhật phân loại" : "Tạo phân loại mới"}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Tên phân loại</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Nhập tên..."
              disabled={isBusy}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Nhập mô tả..."
              disabled={isBusy}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            disabled={isBusy}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isBusy}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white ${
              isBusy
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-lime-500 hover:bg-lime-600"
            }`}
          >
            <Save className="w-4 h-4" />
            {isBusy ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
