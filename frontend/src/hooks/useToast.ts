import { useState, useCallback } from 'react';

interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ToastOptions {
    title: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback(({ title, message, type, duration = 5000 }: ToastOptions) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = {
            id,
            title,
            message,
            type,
            duration
        };

        setToasts((currentToasts) => [...currentToasts, toast]);

        setTimeout(() => {
            setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
        }, duration);
    }, []);

    return {
        toasts,
        showToast
    };
} 