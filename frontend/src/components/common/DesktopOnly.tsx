import React from 'react';
import { motion } from 'framer-motion';

export function DesktopOnly({ children }: { children: React.ReactNode }) {
    const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 1024);

    React.useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isDesktop) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-white flex items-center justify-center px-4"
        >
            <div className="text-center max-w-md">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="mb-6"
                >
                    <svg
                        className="w-24 h-24 mx-auto text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </motion.div>
                <h1 className="text-2xl font-serif mb-4">Desktop Only</h1>
                <p className="text-gray-600">
                    We apologize, but this application is currently only available on desktop devices. Please visit us on a larger screen for the best experience.
                </p>
            </div>
        </motion.div>
    );
} 