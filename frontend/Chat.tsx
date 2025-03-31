import React, { useEffect } from 'react';
import chatService from './chatService';

const Chat = ({ userId }) => {
    useEffect(() => {
        initializeChat();
    }, []);

    async function initializeChat() {
        try {
            console.log('[Chat] Initializing chat for user:', userId);
            await chatService.connect(userId);
        } catch (error) {
            console.error('[Chat] Failed to initialize chat:', error);
            // Optionally display an error message to the user
        }
    }

    return (
        <div>
            <h1>Chat</h1>
            {/* Chat UI components */}
        </div>
    );
};

export default Chat;