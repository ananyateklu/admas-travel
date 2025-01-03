import { motion, HTMLMotionProps } from 'framer-motion';
import { buttonVariants } from '../../../lib/animations/variants';
import React from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'variant'> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors';
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
    };
    const variantStyles = {
        primary: 'bg-gold text-white hover:bg-gold/90',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    };

    return (
        <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            disabled={isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {children}
        </motion.button>
    );
}

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'error' | 'info';
    className?: string;
}

export function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
    const variantStyles = {
        success: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
        warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
        error: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
        info: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className = '' }: CardProps) {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${className}`}
        >
            {children}
        </motion.div>
    );
}

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Avatar({ src, alt = '', fallback, size = 'md', className = '' }: AvatarProps) {
    const sizeStyles = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg'
    };

    if (!src) {
        return (
            <div className={`${sizeStyles[size]} rounded-full bg-gold text-white flex items-center justify-center font-medium ${className}`}>
                {fallback[0].toUpperCase()}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={`${sizeStyles[size]} rounded-full object-cover ${className}`}
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallback)}&background=D4AF37&color=fff`;
            }}
        />
    );
} 