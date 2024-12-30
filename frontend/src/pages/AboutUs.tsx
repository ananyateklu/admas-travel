export default function AboutUs() {
    const teamMembers = [
        {
            name: 'Sarah Johnson',
            role: 'Founder & CEO',
            image: '/team/sarah.jpg',
            description: 'With over 15 years of experience in Ethiopian tourism, Sarah founded Admas Travel to share the authentic beauty of Ethiopia with the world.'
        },
        {
            name: 'Abebe Kebede',
            role: 'Head of Operations',
            image: '/team/abebe.jpg',
            description: 'Born and raised in Lalibela, Abebe brings deep local knowledge and expertise to our tour operations.'
        },
        {
            name: 'Maria Rodriguez',
            role: 'Travel Experience Designer',
            image: '/team/maria.jpg',
            description: 'Maria specializes in creating unique, culturally immersive travel experiences that connect visitors with local communities.'
        }
    ];

    const values = [
        {
            title: 'Authenticity',
            description: 'We believe in showcasing the real Ethiopia, beyond tourist attractions.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            )
        },
        {
            title: 'Sustainability',
            description: 'We are committed to environmentally responsible tourism and supporting local communities.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            )
        },
        {
            title: 'Excellence',
            description: 'We strive for exceptional service and attention to detail in every journey.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            )
        }
    ];

    return (
        <div className="pt-32 min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[60vh] bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
                                Discover Ethiopia with Us
                            </h1>
                            <p className="text-xl text-white/90">
                                Your gateway to authentic Ethiopian experiences, crafted with passion and expertise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Story Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-serif mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-6">
                                Founded in 2020, Admas Travel was born from a passion for sharing Ethiopia's rich cultural heritage
                                and natural wonders with the world. What began as a small team of dedicated travel enthusiasts has
                                grown into a leading tour operator specializing in authentic Ethiopian experiences.
                            </p>
                            <p className="text-gray-600">
                                Our journey has been guided by our commitment to sustainable tourism, supporting local communities,
                                and providing travelers with unforgettable experiences that go beyond traditional tourist routes.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                                <img
                                    src="/about/story-1.jpg"
                                    alt="Ethiopian landscape"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                                <img
                                    src="/about/story-2.jpg"
                                    alt="Local culture"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif text-center mb-16">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((value) => (
                            <div key={value.title} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-6">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif text-center mb-16">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {teamMembers.map((member) => (
                            <div key={member.name} className="text-center">
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden mb-6">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-gold mb-4">{member.role}</p>
                                <p className="text-gray-600">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif mb-6">Ready to Explore Ethiopia?</h2>
                    <p className="text-xl text-white/80 mb-8">
                        Let us help you discover the wonders of this ancient land.
                    </p>
                    <button className="px-8 py-3 bg-gold text-white rounded-full hover:bg-gold-600 transition-colors">
                        Start Planning Your Trip
                    </button>
                </div>
            </section>
        </div>
    );
} 