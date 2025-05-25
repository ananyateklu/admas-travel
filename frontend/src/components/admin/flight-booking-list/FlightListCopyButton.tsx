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

            // Trigger confetti animation
            const confetti = document.createElement('div');
            confetti.className = 'fixed inset-0 pointer-events-none z-50';

            Array.from({ length: 20 }, (_, i) => {
                const sparkle = document.createElement('div');
                sparkle.className = 'absolute animate-ping';
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                sparkle.style.animationDelay = `${i * 50}ms`;
                sparkle.style.animationDuration = '1s';
                sparkle.textContent = '✨';
                confetti.appendChild(sparkle);
            });

            document.body.appendChild(confetti);
            setTimeout(() => document.body.removeChild(confetti), 1000);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', { error: err });
        }
    };

    return (
        <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors group relative overflow-hidden"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
        >
            <div className="relative">
                <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                <div className="relative p-1 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-full border border-forest-400/20">
                    <AnimatePresence mode="wait">
                        {copySuccess ? (
                            <motion.div
                                key="success"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                className="text-green-500"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="copy"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -180 }}
                                className="text-forest-500"
                            >
                                {icon}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <span className="whitespace-nowrap font-medium tracking-wide">
                {copySuccess ? 'Copied!' : label}
            </span>

            {/* Ripple effect on click */}
            <motion.div
                className="absolute inset-0 bg-forest-400/20 rounded-lg"
                initial={{ scale: 0, opacity: 1 }}
                animate={copySuccess ? { scale: 2, opacity: 0 } : {}}
                transition={{ duration: 0.6 }}
            />

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