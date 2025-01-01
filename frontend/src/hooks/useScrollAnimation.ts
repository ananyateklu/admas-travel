import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface ScrollAnimationConfig {
    threshold?: number;
    once?: boolean;
}

export function useScrollAnimation(config: ScrollAnimationConfig = {}) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: config.once ?? true,
        amount: config.threshold ?? 0.3,
        margin: "0px"
    });

    return { ref, isInView };
} 