import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import lalibela from '../assets/beyaynet-food.jpeg';
import banner2 from '../assets/banner2.png';
import bale from '../assets/tibs.jpeg';
import lalibelaChurch from '../assets/lalibela.jpeg';
import tanaLake from '../assets/tana-lake.jpeg';
import gonderCastle from '../assets/gonder.jpg';
import simienMountains from '../assets/rasdashen.jpg';

const ANIMATION_DURATION = 1500;

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
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

    const { ref: heroRef, isInView: isHeroInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { ref: storyRef, isInView: isStoryInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { ref: statsRef, isInView: isStatsInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { ref: testimonialsRef, isInView: isTestimonialsInView } = useScrollAnimation({
        threshold: 0.2,
        once: true
    });

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        if (isStatsInView) {
            animateValue(setTours, 0, 378, ANIMATION_DURATION);
            animateValue(setYearly, 0, 30, ANIMATION_DURATION);
            animateValue(setClients, 0, 2263, ANIMATION_DURATION);
        }
    }, [isStatsInView]);

    const handleImageLoad = (imageSrc: string) => {
        setLoadedImages(prev => new Set(prev).add(imageSrc));
    };

    const [currentTestimonial, setCurrentTestimonial] = useState(0);
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        }
    };

    const imageGridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const imageVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <motion.div
                ref={heroRef}
                className="relative h-[35vh] bg-gray-900 overflow-hidden"
            >
                <motion.img
                    src={banner2}
                    alt="Scenic Travel Destination"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ y }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"
                    style={{ opacity }}
                >
                    <motion.div
                        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center pt-12"
                        initial="hidden"
                        animate={isHeroInView ? "visible" : "hidden"}
                        variants={containerVariants}
                    >
                        <motion.div
                            className="max-w-2xl"
                            variants={itemVariants}
                        >
                            <motion.h1
                                className="text-3xl md:text-4xl font-serif text-white mb-4 drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)]"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Your Journey Begins Here
                            </motion.h1>
                            <motion.p
                                className="text-lg text-white/90"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                Crafting unforgettable travel experiences with passion and expertise.
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Our Story Section */}
            <motion.section
                ref={storyRef}
                className="py-16"
                initial="hidden"
                animate={isStoryInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start">
                        <motion.div
                            className="px-6 max-w-xl"
                            variants={itemVariants}
                        >
                            <motion.h2
                                className="text-2xl font-serif mb-4"
                                variants={itemVariants}
                            >
                                Our Story
                            </motion.h2>
                            <motion.div
                                className="space-y-3 text-gray-600 text-sm"
                                variants={containerVariants}
                            >
                                <motion.p variants={itemVariants}>Welcome to Admas Travel & Tours!</motion.p>
                                <motion.p variants={itemVariants}>We are your travel agent towards a memorable experience in your travel destinations. We are specializing in servicing special requirements for individuals, groups, weddings and honeymoons, corporate and business incentives or meetings.</motion.p>
                                <motion.p variants={itemVariants}>We also specialize in arranging for medical tourism in Taiwan, India and South Africa. We are also arranging visiting Christian pilgrimage experience, including Jordan, Israel, Egypt and Ethiopia.</motion.p>
                                <motion.p variants={itemVariants}>Admas Travel is there for you to create a memorable time about many destinations that will last forever. Your tiny details are our concern, as well as your comfort, joy, and happiness. At Admas Travel, each customer is a VIP for us.</motion.p>
                                <motion.p variants={itemVariants}>We sincerely hope that you will give us the opportunity to serve you better in all your travel needs. For all your travel destinations, including air, hotel, car rental, cruises, safaris or Caribbean vacations, contact us by phone or email.</motion.p>
                                <motion.div
                                    className="pt-4"
                                    variants={containerVariants}
                                >
                                    <motion.h3
                                        className="text-base font-semibold mb-3"
                                        variants={itemVariants}
                                    >
                                        When we say, we can make a world of difference here is why:
                                    </motion.h3>
                                    <motion.ul
                                        className="space-y-2 text-sm"
                                        variants={containerVariants}
                                    >
                                        <motion.li variants={itemVariants}><strong>1. Reliability</strong> - We are providing you with the lowest fares on a broad choice of carriers to worldwide destinations.</motion.li>
                                        <motion.li variants={itemVariants}><strong>2. More choice</strong> - Whatever your destination or choice of carrier, you can rely on Admas Travel & Tours to make all the arrangements under the best available terms.</motion.li>
                                        <motion.li variants={itemVariants}><strong>3. Price</strong> - We can negotiate the most competitive prices with the widest variety of carriers, hotel, and car rental companies, serving the most destinations, and we will try to find you the best value.</motion.li>
                                    </motion.ul>
                                </motion.div>
                                <motion.div
                                    className="pt-4"
                                    variants={containerVariants}
                                >
                                    <motion.p
                                        className="font-semibold text-sm"
                                        variants={itemVariants}
                                    >
                                        Getachew Teklu
                                    </motion.p>
                                    <motion.p
                                        className="text-gold text-xs"
                                        variants={itemVariants}
                                    >
                                        Founder/Travel Consultant
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        <motion.div
                            className="grid grid-cols-2 gap-4 max-w-[600px] justify-end px-4"
                            variants={imageGridVariants}
                        >
                            {[
                                { src: lalibela, alt: "Ethiopian Traditional Food - Beyaynet", title: "Beyaynetu", desc: "A colorful platter of various vegan dishes served on injera" },
                                { src: bale, alt: "Ethiopian Traditional Food - Tibs", title: "Tibs", desc: "Sautéed beef or lamb cubes with vegetables" },
                                { src: lalibelaChurch, alt: "Lalibela Rock-Hewn Churches", title: "Lalibela", desc: "Rock-Hewn Churches" },
                                { src: tanaLake, alt: "Lake Tana", title: "Lake Tana", desc: "Source of the Blue Nile" },
                                { src: gonderCastle, alt: "Gondar Castle", title: "Gondar", desc: "Medieval Castles" },
                                { src: simienMountains, alt: "Simien Mountains", title: "Simien Mountains", desc: "UNESCO World Heritage Site" }
                            ].map((image, index) => (
                                <motion.div
                                    key={image.title}
                                    className={`relative aspect-[4/3] rounded-lg overflow-hidden group hover:shadow-lg transition-all ${index % 2 === 0 ? '-mt-8' : 'mt-8'}`}
                                    variants={imageVariants}
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.img
                                        src={image.src}
                                        alt={image.alt}
                                        className={`w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ${loadedImages.has(image.src) ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => handleImageLoad(image.src)}
                                    />
                                    {!loadedImages.has(image.src) && (
                                        <motion.div
                                            className="absolute inset-0 bg-gray-200 animate-pulse"
                                            initial={{ opacity: 0.8 }}
                                            animate={{ opacity: 0.4 }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    >
                                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                            <h3 className="text-base font-semibold">{image.title}</h3>
                                            <p className="text-xs">{image.desc}</p>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Counters Section */}
            <motion.section
                ref={statsRef}
                className="py-12 bg-gray-50"
                initial="hidden"
                animate={isStatsInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { value: tours, label: "Tour has done successfully" },
                            { value: yearly, label: "Yearly tour arrange" },
                            { value: clients, label: "Happy Clients" }
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="text-center"
                                variants={itemVariants}
                                custom={index}
                            >
                                <motion.div
                                    className="text-3xl font-bold text-gold mb-2"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        delay: index * 0.15
                                    }}
                                >
                                    {stat.value}
                                </motion.div>
                                <motion.div
                                    className="text-gray-600 text-sm"
                                    variants={itemVariants}
                                >
                                    {stat.label}
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.section>

            {/* Testimonials Section */}
            <motion.section
                ref={testimonialsRef}
                className="py-16 bg-white"
                initial="hidden"
                animate={isTestimonialsInView ? "visible" : "hidden"}
                variants={containerVariants}
            >
                <motion.div
                    className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
                    variants={containerVariants}
                >
                    <motion.h2
                        className="text-2xl font-serif text-center mb-12"
                        variants={itemVariants}
                    >
                        What Our Clients Say
                    </motion.h2>
                    <motion.div className="relative">
                        <div className="overflow-hidden min-h-[150px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={testimonials[currentTestimonial].author}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute w-full"
                                >
                                    <div className="text-center">
                                        <p className="text-base text-gray-600 mb-6">"{testimonials[currentTestimonial].text}"</p>
                                        <div className="flex flex-col items-center">
                                            <div className="text-sm font-semibold">{testimonials[currentTestimonial].author}</div>
                                            <div className="flex gap-1 text-gold mt-2 text-sm">
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.span
                                                        key={`star-${testimonials[currentTestimonial].author}-${i}`}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                    >
                                                        ★
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex justify-center mt-6 gap-2">
                            {testimonials.map((_, index) => (
                                <motion.button
                                    key={`testimonial-dot-${testimonials[index].author}`}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentTestimonial ? 'bg-gold' : 'bg-gray-300'}`}
                                    onClick={() => setCurrentTestimonial(index)}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Call to Action */}
            <motion.section
                className="py-16 bg-gray-900 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                    variants={containerVariants}
                >
                    <motion.h2
                        className="text-2xl font-serif mb-4"
                        variants={itemVariants}
                    >
                        Ready to Explore?
                    </motion.h2>
                    <motion.p
                        className="text-base text-white/80 mb-6"
                        variants={itemVariants}
                    >
                        Let us help you discover the wonders of your next destination.
                    </motion.p>
                    <motion.button
                        className="px-6 py-2 bg-gold text-white rounded-full hover:bg-gold-600 transition-all text-sm group"
                        variants={{
                            hover: { scale: 1.03, boxShadow: "0 8px 20px rgba(212, 175, 55, 0.2)" },
                            tap: { scale: 0.95 }
                        }}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <span className="inline-flex items-center">
                            Start Planning Your Trip
                            <motion.span
                                className="ml-2"
                                initial={{ x: 0 }}
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </span>
                    </motion.button>
                </motion.div>
            </motion.section>
        </div>
    );
} 