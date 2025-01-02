import { useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface ScrollAnimationConfig {
    threshold?: number;
    once?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(config: ScrollAnimationConfig = {}) {
    const ref = useRef<T>(null);
    const isInView = useInView(ref, {
        once: config.once ?? true,
        amount: config.threshold ?? 0.3,
        margin: "0px"
    });

    useEffect(() => {
        const element = ref.current;
        if (element) {
            // Add will-change when element is about to come into view
            element.style.willChange = 'transform, opacity';

            // Remove will-change after animations complete
            const cleanup = () => {
                element.style.willChange = 'auto';
            };

            if (isInView && config.once) {
                const timer = setTimeout(cleanup, 1000);
                return () => clearTimeout(timer);
            }

            return cleanup;
        }
    }, [isInView, config.once]);

    return { ref, isInView };
} 