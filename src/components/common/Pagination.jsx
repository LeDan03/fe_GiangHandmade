import { motion } from "framer-motion";

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Prev button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <motion.button
          key={page}
          whileTap={{ scale: 0.9 }}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg text-sm border transition-colors
            ${
              currentPage === page
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white border-gray-300 hover:bg-gray-100"
            }`}
        >
          {page}
        </motion.button>
      ))}

      {/* Next button */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-lg border border-gray-300 bg-white text-sm
                   hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;