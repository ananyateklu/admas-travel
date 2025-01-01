import { Link } from 'react-router-dom';
import danakelImage from '../../assets/danakel.jpg';
import abayRiverImage from '../../assets/abay-river.jpeg';

export function NaturalWonders() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-serif mb-6">Discover Natural Wonders</h2>
                        <p className="text-gray-600 mb-8">
                            From the otherworldly landscapes of the Danakil Depression to the lush Simien Mountains,
                            Ethiopia offers some of Africa's most spectacular natural wonders.
                        </p>
                        <Link
                            to="/natural-wonders"
                            className="inline-block px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Explore More
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img
                            src={danakelImage}
                            alt="Danakil Depression"
                            className="rounded-2xl w-full aspect-[3/4] object-cover"
                        />
                        <img
                            src={abayRiverImage}
                            alt="Blue Nile Falls"
                            className="rounded-2xl w-full aspect-[3/4] object-cover mt-8"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
} 