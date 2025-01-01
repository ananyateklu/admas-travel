import { Highlight } from '../../data/highlights';

interface HighlightsProps {
    highlights: Highlight[];
}

export function Highlights({ highlights }: HighlightsProps) {
    return (
        <section className="py-24 bg-gray-900 mx-4 rounded-[3rem]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl mb-4 text-white">Experience Ethiopia with Us</h2>
                    <p className="text-gray-400">Curated experiences that showcase the best of Ethiopian culture, history, and nature</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {highlights.map((highlight) => (
                        <div key={highlight.id} className="rounded-3xl overflow-hidden aspect-[3/4] relative group">
                            <img
                                src={highlight.image}
                                alt={highlight.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 flex flex-col justify-end">
                                <h3 className="text-2xl font-serif mb-2 text-white">{highlight.title}</h3>
                                <p className="text-white/80">{highlight.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 