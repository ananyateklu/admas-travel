import { useState, useEffect } from 'react';
import lalibela from '../assets/beyaynet-food.jpeg';
import mountains from '../assets/forest.png';
import bale from '../assets/tibs.jpeg';
import lalibelaChurch from '../assets/lalibela.jpeg';
import tanaLake from '../assets/tana-lake.jpeg';
import gonderCastle from '../assets/gonder.jpg';
import simienMountains from '../assets/rasdashen.jpg';

const ANIMATION_DURATION = 2000;

const animateValue = (
    setValue: (value: number) => void,
    start: number,
    end: number,
    duration: number
) => {
    const startTime = performance.now();

    const updateValue = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setValue(Math.floor(progress * (end - start) + start));

        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    };

    requestAnimationFrame(updateValue);
};

export default function AboutUs() {
    const [tours, setTours] = useState(0);
    const [yearly, setYearly] = useState(0);
    const [clients, setClients] = useState(0);

    useEffect(() => {
        animateValue(setTours, 0, 378, ANIMATION_DURATION);
        animateValue(setYearly, 0, 30, ANIMATION_DURATION);
        animateValue(setClients, 0, 2263, ANIMATION_DURATION);
    }, []);

    const testimonials = [
        {
            text: "Great Service! He booked flight and hotel for me for Italy and everything was just as he described. It really took the stress out of planning a vacation.",
            author: "Alex K."
        },
        {
            text: "I like working with Admas Travel because Getachew is very communicative. He is quick to answer any questions I have, and he makes himself very available. Very smooth experience, and I will use his services in the future.",
            author: "Renee S."
        },
        {
            text: "Adams Travel the best agency I have ever seen. They were very professional, timely and found me the best quote for my travel. Getachew is exceptional agent who I arranged my flight with. I definitely would want to continue doing business in the future and I recommend my contacts to check this place out.",
            author: "Jatany H."
        },
        {
            text: "Getachew was so helpful and accommodating with me. Going to Africa is a big trip for me and he gave me in's and out's of what he recommends. He was very knowledgeable and patient as well. I would highly recommend him to others for all their travels needs.",
            author: "Jasmine N."
        }
    ];

    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] bg-gray-900">
                <img
                    src={mountains}
                    alt="Ethiopian Mountains"
                    className="absolute inset-0 w-full h-full object-cover"
                />
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
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.2fr] items-start">
                        <div className="px-8 max-w-2xl">
                            <h2 className="text-3xl font-serif mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>Welcome to Admas Travel & Tours!</p>
                                <p>We are your travel agent towards a memorable experience in your travel destinations. We are specializing in servicing special requirements for individuals, groups, weddings and honeymoons, corporate and business incentives or meetings.</p>
                                <p>We also specialize in arranging for medical tourism in Taiwan, India and South Africa. We are also arranging visiting Christian pilgrimage experience, including Jordan, Israel, Egypt and Ethiopia.</p>
                                <p>Admas Travel is there for you to create a memorable time about many destinations that will last forever. Your tiny details are our concern, as well as your comfort, joy, and happiness. At Admas Travel, each customer is a VIP for us.</p>
                                <p>We sincerely hope that you will give us the opportunity to serve you better in all your travel needs. For all your travel destinations, including air, hotel, car rental, cruises, safaris or Caribbean vacations, contact us by phone or email.</p>
                                <div className="pt-6">
                                    <h3 className="text-xl font-semibold mb-4">When we say, we can make a world of difference here is why:</h3>
                                    <ul className="space-y-3">
                                        <li><strong>1. Reliability</strong> - We are providing you with the lowest fares on a broad choice of carriers to worldwide destinations.</li>
                                        <li><strong>2. More choice</strong> - Whatever your destination or choice of carrier, you can rely on Admas Travel & Tours to make all the arrangements under the best available terms.</li>
                                        <li><strong>3. Price</strong> - We can negotiate the most competitive prices with the widest variety of carriers, hotel, and car rental companies, serving the most destinations, and we will try to find you the best value.</li>
                                    </ul>
                                </div>
                                <div className="pt-6">
                                    <p className="font-semibold">Getachew Teklu</p>
                                    <p className="text-gold">Founder/Travel Consultant</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8 max-w-[800px] justify-end">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group hover:shadow-xl transition-all -mt-12">
                                <img
                                    src={lalibela}
                                    alt="Ethiopian Traditional Food - Beyaynet"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-semibold">Beyaynetu</h3>
                                        <p className="text-sm">A colorful platter of various vegan dishes served on injera, featuring spiced lentils, vegetables, and traditional Ethiopian sauces</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group hover:shadow-xl transition-all mt-12">
                                <img
                                    src={bale}
                                    alt="Ethiopian Traditional Food - Tibs"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-semibold">Tibs</h3>
                                        <p className="text-sm">Sautéed beef or lamb cubes with vegetables, a popular Ethiopian dish known for its tenderness and rich flavoring</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group hover:shadow-xl transition-all -mt-12">
                                <img
                                    src={lalibelaChurch}
                                    alt="Lalibela Rock-Hewn Churches"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-semibold">Lalibela</h3>
                                        <p className="text-sm">Rock-Hewn Churches</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group hover:shadow-xl transition-all mt-12">
                                <img
                                    src={tanaLake}
                                    alt="Lake Tana"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-semibold">Lake Tana</h3>
                                        <p className="text-sm">Source of the Blue Nile</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group hover:shadow-xl transition-all -mt-12">
                                <img
                                    src={gonderCastle}
                                    alt="Gondar Castle"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-semibold">Gondar</h3>
                                        <p className="text-sm">Medieval Castles</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group hover:shadow-xl transition-all mt-12">
                                <img
                                    src={simienMountains}
                                    alt="Simien Mountains"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                        <h3 className="text-xl font-semibold">Simien Mountains</h3>
                                        <p className="text-sm">UNESCO World Heritage Site</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Counters Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gold mb-2">{tours}</div>
                            <div className="text-gray-600">Tour has done successfully</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gold mb-2">{yearly}</div>
                            <div className="text-gray-600">Yearly tour arrange</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gold mb-2">{clients}</div>
                            <div className="text-gray-600">Happy Clients</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif text-center mb-16">What Our Clients Say</h2>
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div className="transition-opacity duration-500">
                                <div className="text-center">
                                    <p className="text-xl text-gray-600 mb-8">"{testimonials[currentTestimonial].text}"</p>
                                    <div className="flex flex-col items-center">
                                        <div className="text-lg font-semibold">{testimonials[currentTestimonial].author}</div>
                                        <div className="flex gap-1 text-gold mt-2">
                                            <span>★</span>
                                            <span>★</span>
                                            <span>★</span>
                                            <span>★</span>
                                            <span>★</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-8 gap-2">
                            {testimonials.map((testimonial, index) => (
                                <button
                                    key={testimonial.author}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentTestimonial ? 'bg-gold' : 'bg-gray-300'}`}
                                    onClick={() => setCurrentTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif mb-6">Ready to Explore?</h2>
                    <p className="text-xl text-white/80 mb-8">
                        Let us help you discover the wonders of your next destination.
                    </p>
                    <button className="px-8 py-3 bg-gold text-white rounded-full hover:bg-gold-600 transition-colors">
                        Start Planning Your Trip
                    </button>
                </div>
            </section>
        </div>
    );
} 