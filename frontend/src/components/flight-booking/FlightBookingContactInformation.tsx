import { motion } from 'framer-motion';

type ContactField = 'contactName' | 'contactEmail' | 'contactPhone';
type AutoFillField = 'name' | 'email' | 'phone';

interface ContactInformationProps {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    onContactChange: (field: ContactField, value: string) => void;
    onAutoFill?: (field: AutoFillField) => void;
    showAutoFill?: boolean;
    errors?: Record<string, string>;
}

export function ContactInformation({
    contactName,
    contactEmail,
    contactPhone,
    onContactChange,
    onAutoFill,
    showAutoFill = false,
    errors = {}
}: ContactInformationProps) {
    const inputClassName = (error: string | undefined) => `
        w-full px-2 py-1 text-xs border rounded-lg
        ${error ? 'border-red-300' : 'border-gray-300'}
        hover:border-gray-400
        focus:outline-none focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400
        disabled:bg-gray-50 disabled:text-gray-500
        placeholder:text-gray-400
        transition-all duration-200
    `;

    return (
        <motion.div
            className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between px-2 py-1 border-b border-gray-300">
                <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-forest-400/10 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h4 className="text-[10px] font-medium text-gray-700">Contact Information</h4>
                </div>
                {showAutoFill && onAutoFill && (
                    <div className="flex items-center gap-2">
                        <motion.button
                            type="button"
                            onClick={() => onAutoFill('name')}
                            className="text-[10px] text-forest-400 hover:text-forest-400/80 transition-colors flex items-center gap-1 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-2.5 h-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Use My Info
                        </motion.button>
                    </div>
                )}
            </div>

            <div className="p-1.5">
                <div className="space-y-1.5">
                    <div>
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Full Name</label>
                            {errors.contactName && <span className="text-[9px] text-red-500">({errors.contactName})</span>}
                        </div>
                        <input
                            type="text"
                            value={contactName}
                            onChange={(e) => onContactChange('contactName', e.target.value)}
                            className={inputClassName(errors.contactName)}
                            placeholder="Contact person name"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Email</label>
                            {errors.contactEmail && <span className="text-[9px] text-red-500">({errors.contactEmail})</span>}
                        </div>
                        <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => onContactChange('contactEmail', e.target.value)}
                            className={inputClassName(errors.contactEmail)}
                            placeholder="For booking confirmation"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Phone</label>
                            {errors.contactPhone && <span className="text-[9px] text-red-500">({errors.contactPhone})</span>}
                        </div>
                        <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => onContactChange('contactPhone', e.target.value)}
                            className={inputClassName(errors.contactPhone)}
                            placeholder="For urgent updates"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 