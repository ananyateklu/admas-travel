import React, { useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../../lib/firebase/useAuth';

// Declare global window property
declare global {
    interface Window {
        convaiScriptLoaded?: boolean;
        convaiElementDefined?: boolean;
    }
}

interface ConvaiChatProps {
    agentId: string;
    position?: 'bottom-right' | 'bottom-left';
}

const createChatElement = (
    agentId: string,
    position: string,
    initializedRef: React.MutableRefObject<boolean>
) => {
    const existingChat = document.querySelector('elevenlabs-convai');
    if (existingChat) return;

    const chatElement = document.createElement('elevenlabs-convai');
    chatElement.setAttribute('agent-id', agentId);
    chatElement.setAttribute('position', position);
    chatElement.style.position = 'fixed';
    chatElement.style.bottom = '20px';
    chatElement.style[position === 'bottom-right' ? 'right' : 'left'] = '20px';
    chatElement.style.zIndex = '1000';

    document.body.appendChild(chatElement);
    initializedRef.current = true;
};

const loadScript = () => {
    if (document.querySelector('script[src*="convai-widget"]')) {
        return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://elevenlabs.io/convai-widget/index.js';
        script.async = true;
        script.type = 'text/javascript';
        script.onload = () => {
            window.convaiScriptLoaded = true;
            resolve();
        };
        script.onerror = () => {
            window.convaiScriptLoaded = false;
            const error = new Error('Failed to load Convai chat widget script');
            console.error(error);
            reject(error);
        };
        document.body.appendChild(script);
    });
};

const initializeChat = async (
    agentId: string,
    position: string,
    initializedRef: React.MutableRefObject<boolean>
) => {
    try {
        const isElementDefined = customElements.get('elevenlabs-convai');
        if (!isElementDefined) {
            await loadScript();
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        createChatElement(agentId, position, initializedRef);
    } catch (error) {
        console.error('Error initializing Convai chat widget:', error);
    }
};

function ConvaiChatComponent({ agentId, position = 'bottom-right' }: ConvaiChatProps) {
    const { user } = useAuth();
    const initialized = useRef(false);

    const cleanupChat = useCallback(() => {
        const existingChat = document.querySelector('elevenlabs-convai');
        if (existingChat) {
            document.body.removeChild(existingChat);
        }
        initialized.current = false;
    }, []);

    useEffect(() => {
        if (!user) {
            cleanupChat();
            return;
        }

        if (initialized.current) return;

        const isElementDefined = customElements.get('elevenlabs-convai');
        if (window.convaiScriptLoaded && isElementDefined) {
            createChatElement(agentId, position, initialized);
            return;
        }

        initializeChat(agentId, position, initialized);
        return cleanupChat;
    }, [agentId, position, user, cleanupChat]);

    return null;
}

export const ConvaiChat = React.memo(ConvaiChatComponent); 