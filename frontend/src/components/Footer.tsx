import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PolicyModal } from './modals/PolicyModal';
import { User } from 'firebase/auth';
import emailjs from '@emailjs/browser';

interface FooterProps {
    user: User | null;
}

interface FooterFormData {
    name: string;
    email: string;
    message: string;
}

export default function Footer({ user }: FooterProps) {
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [formData, setFormData] = useState<FooterFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const termsContent = `Terms of Service

1. Acceptance of Terms
By accessing and using Admas Travel's services, you agree to be bound by these Terms of Service.

2. Use of Service
Our services are provided for personal travel planning and booking purposes.

3. User Accounts
You are responsible for maintaining the confidentiality of your account information.

4. Booking and Payments
All bookings are subject to availability and confirmation.

5. Cancellations and Refunds
Cancellation policies vary by booking type and provider.

6. Privacy
Your use of our services is also governed by our Privacy Policy.

7. Modifications
We reserve the right to modify these terms at any time.

8. Limitation of Liability
We strive to provide accurate information but cannot guarantee complete accuracy.

9. Governing Law
These terms are governed by applicable state and federal laws.`;

    const privacyContent = `Privacy Policy

1. Information Collection
We collect information you provide directly to us and automatically through your use of our services.

2. Use of Information
We use collected information to:
- Process your bookings
- Provide customer support
- Send important notifications
- Improve our services

3. Information Sharing
We do not sell your personal information to third parties.

4. Data Security
We implement appropriate security measures to protect your information.

5. Your Rights
You have the right to:
- Access your personal information
- Request corrections
- Request deletion
- Opt out of marketing communications

6. Cookies
We use cookies to enhance your browsing experience.

7. Updates
We may update this policy periodically.

8. Contact Us
For privacy-related questions, please contact our support team.`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    message: formData.message,
                    to_email: "admastravel@gmail.com"
                }
            );

            setSubmitStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to send email:', error);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <>
            <footer className="bg-gray-900 text-white mt-auto">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-6">
                        {/* Company Info */}
                        <div className="space-y-3 md:col-span-2">
                            <h3 className="text-base font-serif">Admas Travel</h3>
                            <p className="text-xs text-gray-400">
                                Experience the beauty and culture of Ethiopia with our expertly curated travel experiences.
                            </p>
                            <div className="flex space-x-3">
                                <a href="https://www.facebook.com/getachew.teklu.16" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/myethiopic/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://x.com/Simplitour" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">X (Twitter)</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/in/getachewteklu/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">LinkedIn</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href="https://touristlife.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                    <span className="sr-only">Blog</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 2h12a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4V6a4 4 0 014-4zm0 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6zm1 3h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links & Support Combined */}
                        <div className="md:col-span-3">
                            <h3 className="text-xs font-semibold mb-3">Quick Links</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <ul className="space-y-1.5">
                                    <li>
                                        <Link to="/" className="text-xs text-gray-400 hover:text-white transition-colors">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/explore-more" className="text-xs text-gray-400 hover:text-white transition-colors">
                                            Explore Ethiopia
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/about-us" className="text-xs text-gray-400 hover:text-white transition-colors">
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contact" className="text-xs text-gray-400 hover:text-white transition-colors">
                                            Contact Us
                                        </Link>
                                    </li>
                                    {user && (
                                        <li>
                                            <Link to="/bookings" className="text-xs text-gray-400 hover:text-white transition-colors">
                                                My Trips
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                                <ul className="space-y-1.5">
                                    {user && (
                                        <>
                                            <li>
                                                <Link to="/book" className="text-xs text-gray-400 hover:text-white transition-colors">
                                                    Flights
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/hotels" className="text-xs text-gray-400 hover:text-white transition-colors">
                                                    Hotels
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/car-booking" className="text-xs text-gray-400 hover:text-white transition-colors">
                                                    Cars
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <li>
                                        <button
                                            onClick={() => setShowPrivacy(true)}
                                            className="text-xs text-gray-400 hover:text-white transition-colors"
                                        >
                                            Privacy Policy
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setShowTerms(true)}
                                            className="text-xs text-gray-400 hover:text-white transition-colors"
                                        >
                                            Terms & Conditions
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-3">
                            <h3 className="text-xs font-semibold mb-3">Contact Us</h3>
                            <p className="text-xs text-gray-400 mb-3">
                                Send us a message and we'll respond within 24 hours.
                            </p>
                            <form onSubmit={handleSubmit} className="space-y-1.5">
                                <div className="grid grid-cols-2 gap-1.5">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your name"
                                        className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Your email"
                                        className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white"
                                        required
                                    />
                                </div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Your message"
                                    rows={2}
                                    className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded text-xs text-white placeholder-gray-400 focus:outline-none focus:border-white resize-none"
                                    required
                                ></textarea>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-1.5 bg-white text-gray-900 rounded text-xs font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : submitStatus === 'error' ? 'Failed to Send' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 mt-8 pt-6">
                        <p className="text-xs text-gray-400 text-center">
                            © {new Date().getFullYear()} Admas Travel. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Policy Modals */}
            <PolicyModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                title="Terms of Service"
                content={termsContent}
            />
            <PolicyModal
                isOpen={showPrivacy}
                onClose={() => setShowPrivacy(false)}
                title="Privacy Policy"
                content={privacyContent}
            />
        </>
    );
} 