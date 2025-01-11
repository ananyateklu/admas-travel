interface SpecialRequestsProps {
    value: string;
    onChange: (value: string) => void;
}

export function SpecialRequests({ value, onChange }: SpecialRequestsProps) {
    return (
        <div className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
            <div className="flex items-center justify-between px-2 py-1 border-b border-gray-300">
                <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-forest-400/10 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-medium text-gray-700">Special Requests</h4>
                        <p className="text-[9px] text-gray-500">(Optional)</p>
                    </div>
                </div>
            </div>
            <div className="p-1.5">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 hover:border-gray-400 rounded-lg 
                        focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400 focus:outline-none 
                        h-[95px] resize-none transition-colors"
                    placeholder="Any special requirements or preferences? Let us know here..."
                />
                <div className="mt-1">
                    <div className="flex items-center gap-1 text-[9px] text-gray-500">
                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Examples: Dietary restrictions, mobility assistance, seat preferences</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 