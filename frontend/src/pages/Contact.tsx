import { useState } from 'react';
import heroImage from '../assets/plane-boarding.jpg';

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Admas Travel Contact"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Contact Us</h1>
                        <p className="text-xl text-white/90">We're here to help plan your perfect journey</p>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Email</h3>
                            <p className="text-gray-600">admastravel@gmail.com</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Phone</h3>
                            <p className="text-gray-600">+1 (612) 743-7243</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gold/10 rounded-full">
                                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Office</h3>
                            <p className="text-gray-600">2941 Chicago Ave</p>
                            <p className="text-gray-600">Minneapolis, MN 55407</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif mb-4">Get in Touch</h2>
                        <p className="text-gray-600">Have questions about our services? Fill out the form below and we'll get back to you as soon as possible.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="booking">Booking Inquiry</option>
                                    <option value="support">Customer Support</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                                required
                            />
                        </div>
                        <div className="text-center">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif mb-4">Visit Our Office</h2>
                        <p className="text-gray-600">Stop by our office to speak with our travel experts in person</p>
                    </div>
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden">
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
                    </div>
                </div>
            </section>

            {/* Business Hours */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-serif mb-6 text-center">Business Hours</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-center p-4">
                                <h4 className="font-semibold mb-2">Weekdays</h4>
                                <p className="text-gray-600">Monday - Friday</p>
                                <p className="text-gray-600">9:00 AM - 6:00 PM CST</p>
                            </div>
                            <div className="text-center p-4">
                                <h4 className="font-semibold mb-2">Weekends</h4>
                                <p className="text-gray-600">Saturday</p>
                                <p className="text-gray-600">10:00 AM - 4:00 PM CST</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 