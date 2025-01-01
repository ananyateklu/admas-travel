import mountainsBgImage from '../../assets/mountains.jpeg';

export function HeroSection() {
    return (
        <section className="relative min-h-screen bg-white overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={mountainsBgImage}
                    alt="Ethiopian Landscape"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative min-h-screen flex flex-col">
                {/* Main Content */}
                <div className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-8 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
                            {/* Left side - Main Title */}
                            <div className="bg-black/20 backdrop-blur-sm p-12 rounded-3xl flex flex-col justify-center">
                                <p className="text-yellow-400 text-sm tracking-wider mb-4">WELCOME TO THE LAND OF ORIGINS</p>
                                <h1 className="font-serif text-6xl text-white leading-tight mb-6">
                                    Discover Ethiopia's Ancient Wonders
                                </h1>
                                <p className="text-white/80">From rock-hewn churches to volcanic landscapes</p>
                            </div>

                            {/* Right side - Description */}
                            <div className="bg-black/20 backdrop-blur-sm p-12 rounded-3xl flex flex-col justify-between">
                                <p className="text-lg font-light mb-8 max-w-xl text-white">
                                    Experience the cradle of humanity, where ancient traditions meet breathtaking landscapes. Journey through Ethiopia's diverse heritage, from the churches of Lalibela to the tribes of Omo Valley.
                                </p>
                                <button className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors text-sm w-fit">
                                    Start Your Journey
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 