import SendBird from 'sendbird';

class ChatService {
    private sendbird: SendBird;

    constructor(appId: string) {
        this.sendbird = new SendBird({ appId });
    }

    setupConnectionHandlers() {
        try {
            const connectionHandler = new this.sendbird.ConnectionHandler();
            connectionHandler.onReconnectStarted = () => {
                console.log('[ChatService] Reconnecting started...');
            };
            connectionHandler.onReconnectSucceeded = () => {
                console.log('[ChatService] Reconnecting succeeded...');
            };
            connectionHandler.onReconnectFailed = () => {
                console.log('[ChatService] Reconnecting failed...');
            };
            this.sendbird.addConnectionHandler('UNIQUE_HANDLER_ID', connectionHandler);
        } catch (error) {
            console.error('[ChatService] Error setting up connection handler:', error);
            throw error; // Re-throw to propagate the error
        }
    }
}

export default ChatService;