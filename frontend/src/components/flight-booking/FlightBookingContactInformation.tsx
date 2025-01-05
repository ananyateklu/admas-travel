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

interface AutoFillButtonProps {
    field: AutoFillField;
    label: string;
    onAutoFill: (field: AutoFillField) => void;
}

const AutoFillButton = ({ field, label, onAutoFill }: AutoFillButtonProps) => (
    <motion.button
        type="button"
        onClick={() => onAutoFill(field)}
        className="text-xs text-gold hover:text-gold/80 transition-colors flex items-center gap-1 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        <svg className="w-3 h-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Use My {label}
    </motion.button>
);

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
        w-full px-3 py-1.5 text-sm border rounded-lg
        ${error ? 'border-red-300' : 'border-gray-300'}
        hover:border-gray-400
        focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold
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
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                        <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Contact Information</h4>
                </div>
            </div>

            <div className="p-4 grid grid-cols-12 gap-4">
                <motion.div
                    className="col-span-12 lg:col-span-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-medium text-gray-600">Full Name</label>
                        {showAutoFill && onAutoFill && <AutoFillButton field="name" label="Name" onAutoFill={onAutoFill} />}
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={contactName}
                            onChange={(e) => onContactChange('contactName', e.target.value)}
                            className={`${inputClassName(errors.contactName)} pl-8`}
                            placeholder="Contact person's full name"
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center pl-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                    {errors.contactName && (
                        <motion.p
                            className="mt-1 text-xs text-red-500"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {errors.contactName}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    className="col-span-12 lg:col-span-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-medium text-gray-600">Email</label>
                        {showAutoFill && onAutoFill && <AutoFillButton field="email" label="Email" onAutoFill={onAutoFill} />}
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => onContactChange('contactEmail', e.target.value)}
                            className={`${inputClassName(errors.contactEmail)} pl-8`}
                            placeholder="Email for booking confirmation"
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center pl-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    {errors.contactEmail && (
                        <motion.p
                            className="mt-1 text-xs text-red-500"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                        >
                            {errors.contactEmail}
                        </motion.p>
                    )}
                </motion.div>

                <motion.div
                    className="col-span-12 lg:col-span-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-medium text-gray-600">Phone</label>
                        {showAutoFill && onAutoFill && <AutoFillButton field="phone" label="Phone" onAutoFill={onAutoFill} />}
                    </div>
                    <div className="relative">
                        <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => onContactChange('contactPhone', e.target.value)}
                            className={`${inputClassName(errors.contactPhone)} pl-8`}
                            placeholder="Contact phone number"
                        />
                        <div className="absolute left-0 top-0 h-full flex items-center pl-3">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        {errors.contactPhone && (
                            <motion.p
                                className="mt-1 text-xs text-red-500"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                {errors.contactPhone}
                            </motion.p>
                        )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        We'll only use this to contact you about your booking
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
} 