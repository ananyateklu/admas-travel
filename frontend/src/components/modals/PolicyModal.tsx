import { motion, AnimatePresence } from 'framer-motion';

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
}

export function PolicyModal({ isOpen, onClose, title, content }: PolicyModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-[100]">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg mx-4 z-10"
                    >
                        <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                                <h3 className="text-base font-medium text-gray-900">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <div className="prose prose-sm">
                                    <p className="text-sm text-gray-600 whitespace-pre-line">
                                        {content}
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2 p-4 border-t border-gray-200/50">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-4 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-black text-white text-sm transition-colors"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
} 