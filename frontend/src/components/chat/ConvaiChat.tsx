import React, { useRef } from 'react';
import { useAuth } from '../../lib/firebase/useAuth';

// Declare global window property
declare global {
    interface Window {
        convaiScriptLoaded?: boolean;
    }
}

interface ConvaiChatProps {
    agentId: string;
    position?: 'bottom-right' | 'bottom-left';
}

function ConvaiChatComponent({ agentId, position = 'bottom-right' }: ConvaiChatProps) {
    const { user } = useAuth();
    const initialized = useRef(false);

    // Function to clean up chat elements
    const cleanupChat = React.useCallback(() => {
        const existingChat = document.querySelector('elevenlabs-convai');
        if (existingChat) {
            document.body.removeChild(existingChat);
        }
        initialized.current = false;
    }, []);

    // Watch for user changes and cleanup when user logs out
    React.useEffect(() => {
        if (!user) {
            cleanupChat();
        }
    }, [user, cleanupChat]);

    React.useEffect(() => {
        // Only proceed if user is logged in and not already initialized
        if (!user || initialized.current) return;

        const createChatElement = () => {
            const chatElement = document.createElement('elevenlabs-convai');
            chatElement.setAttribute('agent-id', agentId);
            chatElement.setAttribute('position', position);

            // Style the widget
            chatElement.style.position = 'fixed';
            chatElement.style.bottom = '20px';
            chatElement.style[position === 'bottom-right' ? 'right' : 'left'] = '20px';
            chatElement.style.zIndex = '1000';

            document.body.appendChild(chatElement);
            initialized.current = true;
        };

        // If script is already loaded, just create the element
        if (window.convaiScriptLoaded) {
            createChatElement();
            return;
        }

        // Load the script if not already loaded
        try {
            window.convaiScriptLoaded = true;
            const script = document.createElement('script');
            script.src = 'https://elevenlabs.io/convai-widget/index.js';
            script.async = true;
            script.type = 'text/javascript';

            script.onload = createChatElement;
            script.onerror = () => {
                window.convaiScriptLoaded = false;
                console.error('Failed to load Convai chat widget script');
            };

            document.body.appendChild(script);
        } catch (error) {
            window.convaiScriptLoaded = false;
            console.error('Error initializing Convai chat widget:', error);
        }

        // Cleanup on unmount
        return cleanupChat;
    }, [agentId, position, user, cleanupChat]);

    // Return null since we're manually managing the DOM element
    return null;
}

export const ConvaiChat = React.memo(ConvaiChatComponent); 