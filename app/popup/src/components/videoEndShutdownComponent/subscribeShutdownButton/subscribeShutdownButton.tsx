import { ContentScriptMessage, ContentScriptMessageTypeEnum } from 'common';
import React from 'react';
import messanger from '../../../utilities/contentScriptMessaging';

export interface SubscribeShutdownButtonProps {
    disbled: boolean;
}

const subscribeShutdownButton: React.FC<SubscribeShutdownButtonProps> = (props) => {
    const subscribe = () => {
        const message: ContentScriptMessage = {
            type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
        };
        messanger.sendMessageToActiveTab(message);
    };

    return (
        <button
            className={props.disbled ? 'tile-button' : 'tile-button clickable'}
            onClick={subscribe}
            disabled={props.disbled}
        >
            SUBSCRIBE
        </button>
    );
};

export default subscribeShutdownButton;
