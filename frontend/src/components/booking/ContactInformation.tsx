import { motion } from 'framer-motion';

interface ContactInformationProps {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    onContactChange: (field: 'contactName' | 'contactEmail' | 'contactPhone', value: string) => void;
    onAutoFill?: (field: 'name' | 'email' | 'phone') => void;
    showAutoFill?: boolean;
}

export function ContactInformation({
    contactName,
    contactEmail,
    contactPhone,
    onContactChange,
    onAutoFill,
    showAutoFill = false
}: ContactInformationProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        {showAutoFill && onAutoFill && (
                            <motion.button
                                type="button"
                                onClick={() => onAutoFill('name')}
                                className="text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Use My Name
                            </motion.button>
                        )}
                    </div>
                    <input
                        type="text"
                        value={contactName}
                        onChange={(e) => onContactChange('contactName', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                        placeholder="Contact person's full name"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        {showAutoFill && onAutoFill && (
                            <motion.button
                                type="button"
                                onClick={() => onAutoFill('email')}
                                className="text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Use My Email
                            </motion.button>
                        )}
                    </div>
                    <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => onContactChange('contactEmail', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                        placeholder="Email for booking confirmation"
                    />
                </div>

                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        {showAutoFill && onAutoFill && (
                            <motion.button
                                type="button"
                                onClick={() => onAutoFill('phone')}
                                className="text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Use My Phone
                            </motion.button>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => onContactChange('contactPhone', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent pl-12"
                            required
                            placeholder="Contact phone number"
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center pl-4">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        We'll only use this to contact you about your booking
                    </p>
                </div>
            </div>
        </div>
    );
} 