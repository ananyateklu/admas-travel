import { motion } from 'framer-motion';

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    tap: {
        scale: 0.95,
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    }
};

export type TabType = 'details' | 'passengers' | 'contact';

interface BookingTabsProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    canEdit?: boolean;
    isEditing?: boolean;
    onEditToggle?: () => void;
}

export function BookingTabs({
    activeTab,
    onTabChange,
    canEdit,
    isEditing,
    onEditToggle
}: BookingTabsProps) {
    return (
        <motion.div
            className="bg-white/95 rounded-xl shadow-[0_-1px_4px_-2px_rgba(0,0,0,0.05),0_4px_6px_-1px_rgba(0,0,0,0.05)] mb-4 border border-gray-100/50 ring-1 ring-black/[0.02]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="border-b border-gray-100/80">
                <nav className="flex justify-between items-center px-6" aria-label="Booking Information">
                    <div className="flex space-x-8">
                        {['details', 'passengers', 'contact'].map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => onTabChange(tab as TabType)}
                                className={`py-3 px-2 border-b-2 font-medium text-sm tracking-wide whitespace-nowrap relative ${activeTab === tab
                                    ? 'border-forest-400 text-forest-500'
                                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                                    }`}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-forest-300 via-forest-400 to-forest-300"
                                        layoutId="activeTab"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                    {activeTab === 'details' && canEdit && onEditToggle && (
                        <motion.button
                            onClick={onEditToggle}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isEditing
                                ? 'text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200'
                                : 'text-forest-700 bg-forest-50 hover:bg-forest-100 border border-forest-200 hover:border-forest-300'
                                }`}
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <svg
                                className={`w-4 h-4 ${isEditing ? 'text-gray-500' : 'text-forest-600'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="whitespace-nowrap tracking-wide">
                                {isEditing ? 'Cancel Edit' : 'Edit Booking'}
                            </span>
                        </motion.button>
                    )}
                </nav>
            </div>
        </motion.div>
    );
} 