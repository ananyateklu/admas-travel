import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RatingComponentProps {
    currentRating?: number;
    currentComment?: string;
    onSubmitRating: (rating: number, comment: string) => Promise<void>;
    isSubmitting?: boolean;
    readonly?: boolean;
}

export function RatingComponent({
    currentRating = 0,
    currentComment = '',
    onSubmitRating,
    isSubmitting = false,
    readonly = false
}: RatingComponentProps) {
    const [rating, setRating] = useState(currentRating);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState(currentComment);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        const ratingChanged = rating !== currentRating;
        const commentChanged = comment !== currentComment;
        setHasChanges(ratingChanged || commentChanged);
    }, [rating, comment, currentRating, currentComment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmitRating(rating, comment);
    };

    const handleCancel = () => {
        setRating(currentRating);
        setComment(currentComment);
        setHasChanges(false);
    };

    const renderStar = (index: number) => {
        const filled = (hoveredRating || rating) >= index;
        return (
            <motion.button
                type="button"
                key={`star-${index}`}
                className={`text-2xl ${filled ? 'text-yellow-400' : 'text-gray-300'} 
                    ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
                whileHover={readonly ? {} : { scale: 1.1 }}
                whileTap={readonly ? {} : { scale: 0.9 }}
                onClick={() => !readonly && setRating(index)}
                onMouseEnter={() => !readonly && setHoveredRating(index)}
                onMouseLeave={() => !readonly && setHoveredRating(0)}
                disabled={readonly}
            >
                ★
            </motion.button>
        );
    };

    if (readonly && !currentRating) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gold/10 rounded-lg">
                        <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <h3 className="font-medium text-gray-900">Rating</h3>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map(index => renderStar(index))}
                </div>

                {readonly && currentComment && (
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-600 italic">"{currentComment}"</p>
                    </div>
                )}

                {!readonly && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                    >
                        <div className="space-y-4">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts about your experience..."
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
                                rows={4}
                                disabled={readonly}
                            />
                            <AnimatePresence>
                                {hasChanges && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex justify-end gap-2"
                                    >
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting || rating === 0}
                                            className="px-4 py-2 text-sm text-white bg-gold hover:bg-gold/90 rounded-lg disabled:opacity-50 transition-all duration-200 transform"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                    Submitting...
                                                </div>
                                            ) : (
                                                'Submit Rating'
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.form>
                )}
            </div>
        </div>
    );
} 