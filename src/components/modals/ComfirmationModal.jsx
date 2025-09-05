import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  content = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "OK",
  cancelText = "Hủy",
  type = "warning", // warning, danger, success, info
  loading = false,
  confirmButtonClass = "",
  cancelButtonClass = ""
}) => {
  // Không render gì nếu modal không mở
  if (!isOpen) return null;

  // Xử lý click overlay để đóng modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Xử lý phím ESC
  React.useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Định nghĩa các style theo type
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: XCircle,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-100',
          confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          iconBg: 'bg-green-100',
          confirmButton: 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-100',
          confirmButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
        };
      default: // warning
        return {
          icon: AlertTriangle,
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-100',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
        };
    }
  };

  const typeStyles = getTypeStyles();
  const IconComponent = typeStyles.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-scale-up">
        {/* Header với nút X */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            {/* Icon theo type */}
            <div className={`w-12 h-12 ${typeStyles.iconBg} rounded-full flex items-center justify-center`}>
              <IconComponent className={`w-6 h-6 ${typeStyles.iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>

          {/* Nút X để đóng */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{content}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 p-6 pt-0 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ${cancelButtonClass}`}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center ${confirmButtonClass || typeStyles.confirmButton
              }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;