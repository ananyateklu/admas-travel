import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps {
    toasts: Toast[];
}

export function Toast({ toasts }: ToastProps) {
    const getToastStyles = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 text-green-800 border-green-200';
            case 'error':
                return 'bg-red-50 text-red-800 border-red-200';
            case 'warning':
                return 'bg-yellow-50 text-yellow-800 border-yellow-200';
            case 'info':
            default:
                return 'bg-blue-50 text-blue-800 border-blue-200';
        }
    };

    const getToastIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-4">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className={`flex items-start p-4 rounded-lg border shadow-lg ${getToastStyles(toast.type)}`}
                    >
                        <div className="flex-shrink-0">
                            {getToastIcon(toast.type)}
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium">{toast.title}</h3>
                            <div className="mt-1 text-sm opacity-90">
                                {toast.message}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
} 