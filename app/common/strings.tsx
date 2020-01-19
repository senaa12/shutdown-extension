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
            Computer will shutdown when video gets to
            <br />
            <div style={{ margin: '10px', fontWeight: 550, fontSize: '20px'}}>{timer}</div>
        </>),
        otherTab: (onClick: CallbackFunction, tabTitle?: string) => (<>
            Shutdown is already scheduled when video ends at tab:
            <br />
            <div className='link' onClick={onClick}>{tabTitle}</div>
        </>),
    },
};

export const countdownComponentStrings = {
    notScheduledDesciption: 'Select time to shutdown your computer',
    scheduledString: (time: string) => <>Computer will shutdown in: <b>{time}</b></>,
};

export const timerComponentStrings = {
    description: (currentTime: React.ReactNode) => <div style={{ marginBottom: 5, textAlign: 'center' }}>
            Current time is {currentTime} select in what time you want your computer to shutdown</div>,
};

export const title = 'AUTO-SHUTDOWN EXTENSION';
export const nativeAppTitle = 'shutdown.extension.host';

export const links = {
    docs: 'http://www.google.hr',
    nativeWin: 'http://bit.ly/2NyikQx',
};

export const videoPlayerPremiumInfo = (
    <div>
        video player placeholder
    </div>
);

export const hostNotActive = (onClick: CallbackFunction) => (
    <div className={'no-host-message'}>
        <span>EXTENSION WILL NOT WORK!</span>
        <br />
        <span>You need to download and install native part of this extension in order to it working propperly</span>
        <br />
        <div className={'link'} onClick={onClick}>{links.nativeWin}</div>
    </div>
);

export const actionResultsStrings = {
    scanNow: {
        noChanges: 'No Changes',
        iFrameFound: 'New IFrame found',
        videoFound: 'Video Found!',
    },
    shutdown: {
        success: 'Success',
        failed: 'Failed',
        failedCountdown: 'Not supported less than 10 seconds',
        failedTimer: 'Cannot select date in the past',
    },
    cancel: {
        canceledInBackground: 'Tab was Closed and Shutdown is canceled',
        canceled: 'Canceled',
    },
};
