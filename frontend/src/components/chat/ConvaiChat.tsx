import React from 'react';
import { useAuth } from '../../lib/firebase/AuthContext';

interface ConvaiChatProps {
    agentId: string;
    position?: 'bottom-right' | 'bottom-left';
}

function ConvaiChatComponent({ agentId, position = 'bottom-right' }: ConvaiChatProps) {
    const { user } = useAuth();

    // Function to clean up chat elements
    const cleanupChat = React.useCallback(() => {
        const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
        if (existingScript) {
            document.body.removeChild(existingScript);
        }

        const existingChat = document.querySelector('elevenlabs-convai');
        if (existingChat) {
            document.body.removeChild(existingChat);
        }
    }, []);

    // Watch for user changes and cleanup when user logs out
    React.useEffect(() => {
        if (!user) {
            cleanupChat();
        }
    }, [user, cleanupChat]);

    React.useEffect(() => {
        // Only proceed if user is logged in
        if (!user) return;

        // Load the script first
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        script.type = 'text/javascript';

        // Create and append the chat element after script loads
        script.onload = () => {
            const chatElement = document.createElement('elevenlabs-convai');
            chatElement.setAttribute('agent-id', agentId);
            chatElement.setAttribute('position', position);

            // Style the widget
            chatElement.style.position = 'fixed';
            chatElement.style.bottom = '20px';
            chatElement.style[position === 'bottom-right' ? 'right' : 'left'] = '20px';
            chatElement.style.zIndex = '1000';

            document.body.appendChild(chatElement);
        };

        document.body.appendChild(script);

        // Cleanup on unmount
        return cleanupChat;
    }, [agentId, position, user, cleanupChat]);

    // Return null since we're manually managing the DOM element
    return null;
}

export const ConvaiChat = React.memo(ConvaiChatComponent); 