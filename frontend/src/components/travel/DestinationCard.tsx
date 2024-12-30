interface DestinationCardProps {
    title: string;
    description: string;
    imageUrl: string;
    location: {
        city: string;
        country: string;
    };
    bestTimeToVisit: string;
    highlights: string[];
    price: {
        amount: number;
        currency: string;
        duration: string;
    };
    rating: number;
    isPopular?: boolean;
    isRecommended?: boolean;
}

export function DestinationCard({
    title,
    description,
    imageUrl,
    location,
    bestTimeToVisit,
    highlights,
    price,
    rating,
    isPopular,
    isRecommended
}: DestinationCardProps) {
    return (
        <div className='rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
            <div className='relative h-48 lg:h-64'>
                <img
                    src={imageUrl}
                    alt={title}
                    className='w-full h-full object-cover'
                />
                {(isPopular || isRecommended) && (
                    <div className='absolute top-4 right-4 flex gap-2'>
                        {isPopular && (
                            <span className='bg-yellow-500 text-white px-2 py-1 rounded-full text-sm'>Popular</span>
                        )}
                        {isRecommended && (
                            <span className='bg-green-500 text-white px-2 py-1 rounded-full text-sm'>Recommended</span>
                        )}
                    </div>
                )}
            </div>
            <div className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                    <div>
                        <h3 className='text-xl font-semibold'>{title}</h3>
                        <p className='text-gray-600 text-sm'>
                            {location.city}, {location.country}
                        </p>
                    </div>
                    <div className='flex items-center'>
                        <span className='text-yellow-500'>★</span>
                        <span className='ml-1 text-sm'>{rating.toFixed(1)}</span>
                    </div>
                </div>
                <p className='text-gray-600 mb-4'>{description}</p>
                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>Best Time to Visit</h4>
                    <p className='text-gray-600'>{bestTimeToVisit}</p>
                </div>
                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>Highlights</h4>
                    <ul className='list-disc list-inside text-gray-600'>
                        {highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </div>
                <div className='flex justify-between items-center mt-4 pt-4 border-t'>
                    <div>
                        <span className='text-2xl font-bold'>
                            {price.currency}{price.amount.toLocaleString()}
                        </span>
                        <span className='text-gray-600 text-sm ml-1'>/{price.duration}</span>
                    </div>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
} 