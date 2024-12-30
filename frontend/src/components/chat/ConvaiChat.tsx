import { useEffect } from 'react';

interface ConvaiChatProps {
    agentId: string;
    position?: 'bottom-right' | 'bottom-left';
}

export function ConvaiChat({ agentId, position = 'bottom-right' }: ConvaiChatProps) {
    useEffect(() => {
        // Add the script dynamically
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);

        // Add the widget element
        const widget = document.createElement('elevenlabs-convai');
        widget.setAttribute('agent-id', agentId);

        // Position the widget
        widget.style.position = 'fixed';
        widget.style.bottom = '20px';
        widget.style[position === 'bottom-right' ? 'right' : 'left'] = '20px';
        widget.style.zIndex = '1000';

        document.body.appendChild(widget);

        // Cleanup function
        return () => {
            document.body.removeChild(script);
            widget.parentNode?.removeChild(widget);
        };
    }, [agentId, position]);

    // This component doesn't render anything directly
    return null;
} 