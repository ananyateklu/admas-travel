import { motion } from 'framer-motion';
import { CopyButton } from './FlightListCopyButton';
import { StatusBadge } from './FlightListStatusBadge';

interface BookingQuickActionsProps {
    bookingReference: string;
    contactPhone: string;
    contactEmail: string;
    status: string;
    onShare?: () => Promise<void>;
}

export function BookingQuickActions({
    bookingReference,
    contactPhone,
    contactEmail,
    status,
    onShare
}: BookingQuickActionsProps) {
    return (
        <motion.div
            className="flex items-center justify-between mb-3 bg-white/95 backdrop-blur-sm rounded-xl p-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-forest-100/50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className="flex items-center gap-3 overflow-x-auto">
                <CopyButton
                    text={bookingReference}
                    icon={
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    }
                    label="Copy Reference"
                />

                <div className="h-5 w-px bg-gradient-to-b from-forest-200/30 via-forest-200/70 to-forest-200/30"></div>

                <CopyButton
                    text={contactPhone}
                    icon={
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    }
                    label={contactPhone}
                />

                <div className="h-5 w-px bg-gradient-to-b from-forest-200/30 via-forest-200/70 to-forest-200/30"></div>

                <CopyButton
                    text={contactEmail}
                    icon={
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    }
                    label={contactEmail}
                />

                <div className="h-5 w-px bg-gradient-to-b from-forest-200/30 via-forest-200/70 to-forest-200/30"></div>

                <motion.button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                        <div className="relative p-1 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-full border border-forest-400/20">
                            <svg className="w-3 h-3 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                        </div>
                    </div>
                    <span className="whitespace-nowrap font-medium tracking-wide">Print Details</span>
                </motion.button>

                {onShare && (
                    <>
                        <div className="h-5 w-px bg-gradient-to-b from-forest-200/30 via-forest-200/70 to-forest-200/30"></div>
                        <motion.button
                            onClick={onShare}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 rounded-lg transition-colors group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                                <div className="relative p-1 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-full border border-forest-400/20">
                                    <svg className="w-3 h-3 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </div>
                            </div>
                            <span className="whitespace-nowrap font-medium tracking-wide">Share</span>
                        </motion.button>
                    </>
                )}
            </div>
            <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <StatusBadge status={status} className="px-2.5 py-1 text-xs" />
            </motion.div>
        </motion.div>
    );
} 