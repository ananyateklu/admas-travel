interface PackageCardProps {
    title: string;
    description: string;
    imageUrl: string;
    duration: string;
    groupSize: {
        min: number;
        max: number;
    };
    included: string[];
    price: {
        amount: number;
        currency: string;
        perPerson: boolean;
    };
    destinations: Array<{
        city: string;
        country: string;
    }>;
    difficulty: 'Easy' | 'Moderate' | 'Challenging';
    rating: number;
    availableDates: string[];
    isPopular?: boolean;
    isEarlyBird?: boolean;
}

export function PackageCard({
    title,
    description,
    imageUrl,
    duration,
    groupSize,
    included,
    price,
    destinations,
    difficulty,
    rating,
    availableDates,
    isPopular,
    isEarlyBird
}: PackageCardProps) {
    const getDifficultyColor = (level: string) => {
        switch (level) {
            case 'Easy':
                return 'bg-green-100 text-green-800';
            case 'Moderate':
                return 'bg-yellow-100 text-yellow-800';
            case 'Challenging':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
            <div className='relative h-48 lg:h-64'>
                <img
                    src={imageUrl}
                    alt={title}
                    className='w-full h-full object-cover'
                />
                {(isPopular || isEarlyBird) && (
                    <div className='absolute top-4 right-4 flex gap-2'>
                        {isPopular && (
                            <span className='bg-yellow-500 text-white px-2 py-1 rounded-full text-sm'>Popular</span>
                        )}
                        {isEarlyBird && (
                            <span className='bg-green-500 text-white px-2 py-1 rounded-full text-sm'>Early Bird</span>
                        )}
                    </div>
                )}
            </div>
            <div className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                    <div>
                        <h3 className='text-xl font-semibold'>{title}</h3>
                        <div className='flex gap-2 mt-1'>
                            {destinations.map((dest) => (
                                <span key={`${dest.city}-${dest.country}`} className='text-gray-600 text-sm'>
                                    {dest.city}, {dest.country}
                                    {dest !== destinations[destinations.length - 1] ? ' → ' : ''}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <span className='text-yellow-500'>★</span>
                        <span className='ml-1 text-sm'>{rating.toFixed(1)}</span>
                    </div>
                </div>
                <p className='text-gray-600 mb-4'>{description}</p>

                <div className='grid grid-cols-2 gap-4 mb-4'>
                    <div>
                        <h4 className='font-semibold mb-2'>Duration</h4>
                        <p className='text-gray-600'>{duration}</p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Group Size</h4>
                        <p className='text-gray-600'>{groupSize.min}-{groupSize.max} people</p>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Difficulty</h4>
                        <span className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(difficulty)}`}>
                            {difficulty}
                        </span>
                    </div>
                    <div>
                        <h4 className='font-semibold mb-2'>Next Date</h4>
                        <p className='text-gray-600'>{availableDates[0]}</p>
                    </div>
                </div>

                <div className='mb-4'>
                    <h4 className='font-semibold mb-2'>What's Included</h4>
                    <ul className='list-disc list-inside text-gray-600'>
                        {included.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className='flex justify-between items-center mt-4 pt-4 border-t'>
                    <div>
                        <span className='text-2xl font-bold'>
                            {price.currency}{price.amount.toLocaleString()}
                        </span>
                        <span className='text-gray-600 text-sm ml-1'>
                            {price.perPerson ? '/person' : '/group'}
                        </span>
                    </div>
                    <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'>
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
} 