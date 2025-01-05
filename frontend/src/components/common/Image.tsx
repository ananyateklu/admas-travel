import { motion } from 'framer-motion';

interface ImageProps {
    src: string;
    alt: string;
    className?: string;
    priority?: boolean;
}

export function Image({ src, alt, className = '', priority = false }: ImageProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`relative overflow-hidden ${className}`}
        >
            <img
                src={src}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover"
            />
        </motion.div>
    );
} 