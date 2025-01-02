import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import heroImage from '../assets/mountain-two.jpg';
import emailjs from '@emailjs/browser';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export default function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const { ref: heroRef, isInView: isHeroInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { ref: contactInfoRef, isInView: isContactInfoInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { ref: formRef, isInView: isFormInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { ref: mapRef, isInView: isMapInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Initialize EmailJS with your public key
            emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

            // Send email using EmailJS
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                    to_email: "admastravel@gmail.com" // Your business email
                }
            );

            setSubmitStatus('success');
            // Reset form after success
            setTimeout(() => {
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
                setSubmitStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Failed to send email:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const renderButtonContent = () => {
        if (isSubmitting) {
            return (
                <motion.div
                    key="submitting"
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                </motion.div>
            );
        }

        if (submitStatus === 'success') {
            return (
                <motion.div
                    key="success"
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Message Sent!
                </motion.div>
            );
        }

        if (submitStatus === 'error') {
            return (
                <motion.div
                    key="error"
                    className="flex items-center text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Failed to Send
                </motion.div>
            );
        }

        return (
            <motion.span
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                Send Message
            </motion.span>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <motion.div
                ref={heroRef}
                className="relative h-[70vh] bg-gray-900"
                initial="hidden"
                animate={isHeroInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="absolute inset-0"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={heroImage}
                        alt="Admas Travel Contact"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                </motion.div>
                <div className="relative h-full flex items-center justify-center text-center">
                    <motion.div
                        variants={itemVariants}
                        className="max-w-3xl px-4"
                    >
                        <motion.h1
                            className="text-4xl md:text-5xl font-serif text-white mb-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Contact Us
                        </motion.h1>
                        <motion.p
                            className="text-xl text-white/90"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            We're here to help plan your perfect journey
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Contact Information */}
            <motion.section
                ref={contactInfoRef}
                className="py-16 bg-gray-50"
                initial="hidden"
                animate={isContactInfoInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                ),
                                title: "Email",
                                info: "admastravel@gmail.com",
                                action: "mailto:admastravel@gmail.com"
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                ),
                                title: "Phone",
                                info: "+1 (612) 743-7243",
                                action: "tel:+16127437243"
                            },
                            {
                                icon: (
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                title: "Office",
                                info: "2941 Chicago Ave, Minneapolis, MN 55407",
                                action: "https://maps.google.com/?q=2941+Chicago+Ave,+Minneapolis,+MN+55407"
                            }
                        ].map((item) => (
                            <motion.div
                                key={item.title}
                                className="text-center border border-gray-100 rounded-xl p-6 bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.15),0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <motion.a
                                    href={item.action}
                                    className="block group"
                                    target={item.action.startsWith('http') ? '_blank' : undefined}
                                    rel={item.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                                >
                                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full group-hover:bg-gold/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 group-hover:text-gold transition-colors">{item.info}</p>
                                </motion.a>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* Contact Form Section */}
            <motion.section
                ref={formRef}
                className="py-16"
                initial="hidden"
                animate={isFormInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div className="max-w-4xl mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        variants={itemVariants}
                    >
                        <h2 className="text-3xl font-serif mb-4">Get in Touch</h2>
                        <p className="text-gray-600">Have questions about our services? Fill out the form below and we'll get back to you as soon as possible.</p>
                    </motion.div>
                    <motion.form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] p-8 border border-gray-100"
                        variants={containerVariants}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {[
                                { label: "Full Name", name: "name", type: "text" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Phone", name: "phone", type: "tel" },
                                {
                                    label: "Subject",
                                    name: "subject",
                                    type: "select",
                                    options: [
                                        { value: "", label: "Select a subject" },
                                        { value: "booking", label: "Booking Inquiry" },
                                        { value: "support", label: "Customer Support" },
                                        { value: "partnership", label: "Partnership" },
                                        { value: "feedback", label: "Feedback" },
                                        { value: "other", label: "Other" }
                                    ]
                                }
                            ].map((field) => (
                                <motion.div
                                    key={field.name}
                                    variants={itemVariants}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>
                                    {field.type === "select" ? (
                                        <select
                                            name={field.name}
                                            value={formData[field.name as keyof ContactFormData]}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
                                            required
                                        >
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name as keyof ContactFormData]}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
                                            required={field.name !== "phone"}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            className="mb-6"
                            variants={itemVariants}
                        >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-shadow"
                                required
                            />
                        </motion.div>
                        <motion.div
                            className="text-center"
                            variants={itemVariants}
                        >
                            <motion.button
                                type="submit"
                                className="relative px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <AnimatePresence mode="wait">
                                    {renderButtonContent()}
                                </AnimatePresence>
                            </motion.button>
                        </motion.div>
                    </motion.form>
                </div>
            </motion.section>

            {/* Map Section */}
            <motion.section
                ref={mapRef}
                className="py-16 bg-gray-50"
                initial="hidden"
                animate={isMapInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="max-w-7xl mx-auto px-4"
                    variants={containerVariants}
                >
                    <motion.div
                        className="text-center mb-12"
                        variants={itemVariants}
                    >
                        <h2 className="text-3xl font-serif mb-4">Visit Our Office</h2>
                        <p className="text-gray-600">Stop by our office to speak with our travel experts in person</p>
                    </motion.div>
                    <motion.div
                        className="aspect-[16/9] rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, boxShadow: "0 15px 35px -5px rgba(0,0,0,0.15), 0 20px 40px -10px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2824.3838098912186!2d-93.26414812346976!3d44.94833997123814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f627f1e7bcf8b7%3A0x4a17d67f0de9eab0!2s2941%20Chicago%20Ave%2C%20Minneapolis%2C%20MN%2055407!5e0!3m2!1sen!2sus!4v1704007169799!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Admas Travel Office Location"
                        />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Business Hours */}
            <motion.section
                className="py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="max-w-4xl mx-auto px-4"
                    variants={containerVariants}
                >
                    <motion.div
                        className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1),0_12px_25px_-5px_rgba(0,0,0,0.05)] p-8 border border-gray-100"
                        whileHover={{ boxShadow: "0 15px 35px -5px rgba(0,0,0,0.15), 0 20px 40px -10px rgba(0,0,0,0.1)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.h3
                            className="text-2xl font-serif mb-6 text-center"
                            variants={itemVariants}
                        >
                            Business Hours
                        </motion.h3>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            variants={containerVariants}
                        >
                            {[
                                {
                                    title: "Weekdays",
                                    days: "Monday - Friday",
                                    hours: "9:00 AM - 6:00 PM CST"
                                },
                                {
                                    title: "Weekends",
                                    days: "Saturday",
                                    hours: "10:00 AM - 4:00 PM CST",
                                    additional: "Sunday: Closed"
                                }
                            ].map((schedule) => (
                                <motion.div
                                    key={schedule.title}
                                    className="text-center p-4"
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <h4 className="font-semibold mb-2">{schedule.title}</h4>
                                    <p className="text-gray-600">{schedule.days}</p>
                                    <p className="text-gray-600">{schedule.hours}</p>
                                    {schedule.additional && (
                                        <p className="text-gray-600">{schedule.additional}</p>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>
        </div>
    );
} 