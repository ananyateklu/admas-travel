import mountains from '../assets/mountains.jpeg';

export default function About() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[45vh] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src={mountains}
                        alt="Mountain Landscape"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative h-full flex items-center justify-center text-center pt-[112px]">
                    <div className="max-w-4xl mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">About Admas Travel</h1>
                        <p className="text-xl text-white/90">Your trusted partner in extraordinary journeys</p>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif mb-4">Our Mission</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        At Admas Travel, we believe in creating unforgettable travel experiences that connect people with the world's most extraordinary destinations. Our mission is to provide exceptional service, authentic experiences, and seamless travel arrangements for every journey.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 text-gold">
                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif mb-2">Local Expertise</h3>
                        <p className="text-gray-600">
                            Deep knowledge of destinations and authentic local experiences
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 text-gold">
                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif mb-2">24/7 Support</h3>
                        <p className="text-gray-600">
                            Round-the-clock assistance for peace of mind during your travels
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 text-gold">
                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif mb-2">Trusted Service</h3>
                        <p className="text-gray-600">
                            Reliable and professional travel arrangements you can count on
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-serif text-center mb-12">Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200" />
                            <h3 className="text-xl font-serif text-center mb-2">John Doe</h3>
                            <p className="text-gray-600 text-center mb-4">Founder & CEO</p>
                            <p className="text-gray-600 text-center">
                                20+ years of experience in luxury travel and destination management.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200" />
                            <h3 className="text-xl font-serif text-center mb-2">Jane Smith</h3>
                            <p className="text-gray-600 text-center mb-4">Travel Director</p>
                            <p className="text-gray-600 text-center">
                                Expert in creating unique and memorable travel experiences.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200" />
                            <h3 className="text-xl font-serif text-center mb-2">Mike Johnson</h3>
                            <p className="text-gray-600 text-center mb-4">Customer Experience</p>
                            <p className="text-gray-600 text-center">
                                Dedicated to ensuring exceptional service for every client.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif mb-8">Get in Touch</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Ready to start planning your next adventure? Our team is here to help you create the perfect travel experience.
                    </p>
                    <button className="px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors">
                        Contact Us
                    </button>
                </div>
            </div>
        </div>
    );
} 