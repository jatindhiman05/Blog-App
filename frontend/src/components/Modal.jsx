import React, { useEffect } from "react";
import { X } from "lucide-react";

function Modal({
    isOpen,
    onClose,
    title,
    children,
    actionButton,
    cancelButtonText = "Cancel",
    maxWidth = "max-w-md",
}) {
    // Close modal on Escape key press
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal container */}
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                    className={`inline-block align-bottom bg-white dark:bg-darkcard rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${maxWidth}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-gray-200 dark:border-darkborder">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-darktext">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-darktext/70 focus:outline-none"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">{children}</div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-darkbg flex justify-end  gap-3 border-t border-gray-200 dark:border-darkborder">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 dark:text-darktext  rounded-lg transition-colors"
                        >
                            {cancelButtonText}
                        </button>
                        {actionButton}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;