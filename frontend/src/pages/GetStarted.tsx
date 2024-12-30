import { useState } from 'react';
import { Link } from 'react-router-dom';

interface TravelPreference {
    travelStyle: string;
    destination: string;
    budget: string;
    duration: string;
    interests: string[];
}

interface QuizQuestion {
    id: string;
    question: string;
    options: {
        value: string;
        label: string;
        description?: string;
        icon?: string;
    }[];
    type: 'single' | 'multiple';
}

const quizQuestions: QuizQuestion[] = [
    {
        id: 'travelStyle',
        question: 'What\'s your preferred travel style?',
        options: [
            { value: 'luxury', label: 'Luxury', description: 'High-end accommodations and exclusive experiences', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { value: 'comfort', label: 'Comfort', description: 'Quality accommodations with a good balance', icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' },
            { value: 'adventure', label: 'Adventure', description: 'Active experiences and unique accommodations', icon: 'M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' },
            { value: 'budget', label: 'Budget', description: 'Cost-effective options and local experiences', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ],
        type: 'single'
    },
    {
        id: 'destination',
        question: 'Which region interests you the most?',
        options: [
            { value: 'ethiopia', label: 'Ethiopia', description: 'Ancient churches, rich culture, and stunning landscapes', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'africa', label: 'Other African Countries', description: 'Safaris, beaches, and diverse cultures', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'middleEast', label: 'Middle East', description: 'Rich history, architecture, and traditions', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'global', label: 'Global Destinations', description: 'Worldwide travel experiences', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ],
        type: 'single'
    },
    {
        id: 'budget',
        question: 'What\'s your budget range per person?',
        options: [
            { value: 'luxury', label: '$5,000+', description: 'Luxury accommodations and experiences', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'comfort', label: '$3,000-$5,000', description: 'Quality accommodations and experiences', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'moderate', label: '$1,500-$3,000', description: 'Good value accommodations and experiences', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'budget', label: 'Under $1,500', description: 'Budget-friendly options', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
        ],
        type: 'single'
    },
    {
        id: 'duration',
        question: 'How long would you like to travel?',
        options: [
            { value: 'short', label: '1-7 days', description: 'Perfect for quick getaways', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'medium', label: '8-14 days', description: 'Ideal for in-depth exploration', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'long', label: '15-21 days', description: 'Comprehensive travel experience', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'extended', label: '22+ days', description: 'Extended travel adventures', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
        ],
        type: 'single'
    },
    {
        id: 'interests',
        question: 'What interests you the most? (Select all that apply)',
        options: [
            { value: 'culture', label: 'Culture & History', description: 'Ancient sites, museums, and local traditions', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'nature', label: 'Nature & Wildlife', description: 'National parks, wildlife, and landscapes', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'food', label: 'Food & Cuisine', description: 'Culinary experiences and local flavors', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'adventure', label: 'Adventure & Activities', description: 'Hiking, trekking, and outdoor activities', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'relaxation', label: 'Relaxation & Wellness', description: 'Spa, wellness, and peaceful retreats', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: 'photography', label: 'Photography', description: 'Scenic spots and photo opportunities', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
        ],
        type: 'multiple'
    }
];

const quickStartSteps = [
    {
        title: 'Discover Your Style',
        description: 'Take our quick travel quiz to help us understand your preferences.',
        icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
        title: 'Explore Options',
        description: 'Browse our curated selection of destinations and experiences.',
        icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
    },
    {
        title: 'Customize Your Trip',
        description: 'Work with our travel experts to create your perfect itinerary.',
        icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
    },
    {
        title: 'Book with Confidence',
        description: 'Secure your travel arrangements with our trusted booking system.',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    }
];

const resources = [
    {
        title: 'Travel Guides',
        description: 'Comprehensive guides for all our destinations',
        icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
    },
    {
        title: 'Visa Information',
        description: 'Essential visa requirements and processes',
        icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2'
    },
    {
        title: 'Packing Lists',
        description: 'Customized packing recommendations',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
    },
    {
        title: 'Travel Insurance',
        description: 'Insurance options and recommendations',
        icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    }
];

export default function GetStarted() {
    const [currentStep, setCurrentStep] = useState(0);
    const [preferences, setPreferences] = useState<TravelPreference>({
        travelStyle: '',
        destination: '',
        budget: '',
        duration: '',
        interests: []
    });

    const handleSingleAnswer = (questionId: string, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [questionId]: value
        }));
        if (currentStep < quizQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleMultipleAnswer = (questionId: string, value: string) => {
        setPreferences(prev => {
            if (questionId === 'interests') {
                const newInterests = prev.interests.includes(value)
                    ? prev.interests.filter(v => v !== value)
                    : [...prev.interests, value];
                return { ...prev, interests: newInterests };
            }
            return { ...prev, [questionId]: [value] };
        });
    };

    const handleNext = () => {
        if (currentStep < quizQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const currentQuestion = quizQuestions[currentStep];

    const getOptionClassName = (questionId: string, optionValue: string) => {
        const baseClasses = 'p-4 rounded-xl border-2 text-left transition-all';
        if (currentQuestion.type === 'single') {
            return `${baseClasses} ${preferences[questionId as keyof TravelPreference] === optionValue
                ? 'border-gold bg-gold/5'
                : 'border-gray-200 hover:border-gold/50'}`;
        }
        return `${baseClasses} ${preferences.interests.includes(optionValue)
            ? 'border-gold bg-gold/5'
            : 'border-gray-200 hover:border-gold/50'}`;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[50vh] bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src="/src/assets/mountains.jpeg"
                        alt="Travel Planning"
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
                </div>
                <div className="relative h-full flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                            Start Your Journey
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl">
                            Let us help you plan the perfect trip. Take our quick quiz to get personalized recommendations.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Start Steps */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif mb-12 text-center">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {quickStartSteps.map((step, index) => (
                            <div key={step.title} className="relative">
                                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                                        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                    {index < quickStartSteps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Travel Quiz Section */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-serif">Travel Preferences Quiz</h3>
                                <span className="text-sm text-gray-500">
                                    Step {currentStep + 1} of {quizQuestions.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gold rounded-full h-2 transition-all duration-300"
                                    style={{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="text-xl mb-6">{currentQuestion.question}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => currentQuestion.type === 'single'
                                            ? handleSingleAnswer(currentQuestion.id, option.value)
                                            : handleMultipleAnswer(currentQuestion.id, option.value)
                                        }
                                        className={getOptionClassName(currentQuestion.id, option.value)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-8 h-8 flex-shrink-0 bg-gold/10 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                                                </svg>
                                            </div>
                                            <div>
                                                <h5 className="font-medium mb-1">{option.label}</h5>
                                                <p className="text-sm text-gray-600">{option.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={handleBack}
                                disabled={currentStep === 0}
                                className="px-6 py-2 text-gray-600 disabled:opacity-50"
                            >
                                Back
                            </button>
                            {currentQuestion.type === 'multiple' && (
                                <button
                                    onClick={handleNext}
                                    disabled={currentStep === quizQuestions.length - 1}
                                    className="px-6 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors disabled:opacity-50"
                                >
                                    Next
                                </button>
                            )}
                        </div>

                        {currentStep === quizQuestions.length - 1 && preferences.interests.length > 0 && (
                            <div className="mt-8 pt-8 border-t">
                                <Link
                                    to="/book"
                                    className="block w-full px-6 py-3 bg-gold text-white rounded-lg text-center hover:bg-gold/90 transition-colors"
                                >
                                    See Recommended Trips
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif mb-12 text-center">Travel Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {resources.map((resource) => (
                            <div key={resource.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={resource.icon} />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                                <p className="text-gray-600">{resource.description}</p>
                                <button className="mt-4 text-gold hover:text-gold/80 transition-colors">
                                    Learn More →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-24 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-serif mb-6 text-white">Ready to Start Planning?</h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Our travel experts are here to help you create the perfect itinerary based on your preferences.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contact"
                            className="px-8 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
                        >
                            Contact an Expert
                        </Link>
                        <Link
                            to="/book"
                            className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
} 