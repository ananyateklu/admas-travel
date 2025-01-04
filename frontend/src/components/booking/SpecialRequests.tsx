interface SpecialRequestsProps {
    value: string;
    onChange: (value: string) => void;
}

export function SpecialRequests({ value, onChange }: SpecialRequestsProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                        <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-700">Special Requests</h4>
                        <p className="text-xs text-gray-500">(Optional)</p>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="relative">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 hover:border-gray-400 rounded-lg 
                            focus:ring-1 focus:ring-gold/30 focus:border-gold focus:outline-none 
                            min-h-[120px] transition-colors"
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
        </div>
    );
} 