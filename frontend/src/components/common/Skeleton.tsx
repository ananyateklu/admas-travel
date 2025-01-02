interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-6">
            <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-20" />
        </div>
    );
}

const POPULAR_DEST_IDS = ['pd1', 'pd2', 'pd3', 'pd4', 'pd5'];
const BOOKING_STATUS_IDS = ['bs1', 'bs2', 'bs3', 'bs4'];

export function PopularDestinationsSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
                {POPULAR_DEST_IDS.map((id) => (
                    <div key={id} className="space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function BookingStatusSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {BOOKING_STATUS_IDS.map((id) => (
                    <div key={id}>
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>
        </div>
    );
} 