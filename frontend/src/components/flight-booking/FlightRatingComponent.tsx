import React, { useState } from 'react';

interface RatingComponentProps {
    currentRating?: number;
    currentComment?: string;
    onSubmitRating: (rating: number, comment: string) => Promise<void>;
    isSubmitting?: boolean;
    readonly?: boolean;
}

export function RatingComponent({
    currentRating,
    currentComment,
    onSubmitRating,
    isSubmitting = false,
    readonly = false
}: RatingComponentProps) {
    const [rating, setRating] = useState<number>(currentRating ?? 0);
    const [comment, setComment] = useState<string>(currentComment ?? '');
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmitRating) {
            await onSubmitRating(rating, comment);
        }
    };

    return (
        <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-gold/10 rounded-lg">
                    <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </div>
                <div>
                    <h4 className="text-xs font-medium text-gray-900">Rating</h4>
                    <p className="text-[10px] text-gray-500">Rate your experience</p>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => !readonly && setRating(star)}
                            onMouseEnter={() => !readonly && setHoveredStar(star)}
                            onMouseLeave={() => !readonly && setHoveredStar(null)}
                            className={`p-0.5 transition-colors ${readonly ? 'cursor-default' : 'hover:text-yellow-400'}`}
                            disabled={readonly || isSubmitting}
                        >
                            {(() => {
                                const isStarActive = hoveredStar !== null ? star <= hoveredStar : star <= rating;
                                return (
                                    <svg
                                        className={`w-4 h-4 ${isStarActive ? 'text-yellow-400' : 'text-gray-300'}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                );
                            })()}
                        </button>
                    ))}
                    <span className="text-[10px] text-gray-500 ml-1">
                        {rating} out of 5
                    </span>
                </div>
                <div>
                    <textarea
                        value={comment}
                        onChange={(e) => !readonly && setComment(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-gold focus:border-transparent resize-none"
                        rows={2}
                        disabled={readonly || isSubmitting}
                    />
                </div>
                {!readonly && (
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={rating === 0 || isSubmitting}
                            className="px-3 py-1 text-xs text-white bg-gold hover:bg-gold/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
} 