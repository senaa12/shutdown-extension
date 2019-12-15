import { ContentScriptMessage, ContentScriptMessageTypeEnum } from 'common';
import React from 'react';
import messanger from '../../utilities/contentScriptMessaging';

import './tile.scss';

const tile: React.FC = () => {
    const subscribeToVideoEnd = () => {
        const message: ContentScriptMessage = {
            type: ContentScriptMessageTypeEnum.SubscribeToVideoEnd,
        };
        // tslint:disable-next-line: no-console
        messanger.sendMessageToActiveTab(message, console.log);
    };

    return(
        <>
            <div className='tile-button' onClick={subscribeToVideoEnd}>
                Subscribe
            </div>
        </>
    );
};

export default tile;
