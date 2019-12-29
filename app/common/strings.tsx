import React from 'react';
import { CallbackFunction } from './actionModels';

export const videoPlayerStrings = {
    notAvailable: 'This WebPage cannot use this extension, try clicking scan now button to check again',
    videoAvailable: 'Extension can be used on this WebPage because there is video tag available. Write at what time you want your computer to shut down',
    iframeAvailable: (onClick: CallbackFunction) => (<>
        This WebPage does not contain Video directly but does contain IFrame window
        <br />
        <div className='link' onClick={onClick}>CLICK HERE TO NAVIGATE TO IT</div>
    </>),
    shutdownSubscribed: {
        thisTab: (timer: string) => (<>
            Computer will shutdown when video gets to {timer}
        </>),
        otherTab: (onClick: CallbackFunction, tabTitle?: string) => (<>
            Shutdown is already scheduled when video ends at tab:
            <br />
            <div className='link' onClick={onClick}>{tabTitle}</div>
        </>),
    },
};

export const scanActionResultString = {
    noResult: 'No tags found.',
};
