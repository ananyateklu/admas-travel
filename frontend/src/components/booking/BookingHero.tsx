interface BookingHeroProps {
    backgroundImage: string;
    title?: string;
    subtitle?: string;
}

export function BookingHero({
    backgroundImage,
    title = "Book Your Journey",
    subtitle = "Let us help you plan your perfect trip"
}: BookingHeroProps) {
    return (
        <div className="relative h-[70vh] bg-gray-900">
            <div className="absolute inset-0">
                <img
                    src={backgroundImage}
                    alt="View from Airplane Window"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative h-full flex items-center justify-center text-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{title}</h1>
                    <p className="text-xl text-white/90">{subtitle}</p>
                </div>
            </div>
        </div>
    );
} 