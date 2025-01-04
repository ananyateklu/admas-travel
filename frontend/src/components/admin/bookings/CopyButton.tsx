import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const buttonVariants = {
    hover: {
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    }
};

interface CopyButtonProps {
    text: string;
    icon: React.ReactNode;
    label: string;
    successMessage?: string;
}

export function CopyButton({ text, icon, label, successMessage = 'Copied!' }: CopyButtonProps) {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors group relative"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                <div className="relative p-1 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-full border border-forest-400/20">
                    <span className="text-forest-500">
                        {icon}
                    </span>
                </div>
            </div>
            <span className="whitespace-nowrap font-medium tracking-wide">{label}</span>
            <AnimatePresence>
                {copySuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white/95 text-forest-600 text-[10px] font-medium px-2 py-0.5 rounded-lg shadow-lg border border-forest-100/50 backdrop-blur-sm whitespace-nowrap"
                    >
                        {successMessage}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-[3px] border-transparent border-t-white/95 filter drop-shadow-sm"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
} 