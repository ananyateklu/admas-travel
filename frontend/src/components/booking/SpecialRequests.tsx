interface SpecialRequestsProps {
    value: string;
    onChange: (value: string) => void;
}

export function SpecialRequests({ value, onChange }: SpecialRequestsProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Special Requests</h3>
                <span className="text-xs text-gray-500">(Optional)</span>
            </div>
            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent min-h-[120px]"
                    placeholder="Any special requirements or preferences? Let us know here..."
                    rows={4}
                />
                <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Examples: Dietary restrictions, mobility assistance, seat preferences</span>
                    </div>
                </div>
            </div>
            <div className="mt-2 flex items-start gap-2">
                <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-500">
                    While we'll do our best to accommodate your requests, please note that they are subject to availability and cannot be guaranteed.
                </p>
            </div>
        </div>
    );
} 