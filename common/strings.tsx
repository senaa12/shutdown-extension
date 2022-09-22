import React from 'react';
import { CallbackFunction } from './actionModels';

export const videoPlayerStrings = {
    notAvailable: 'This web page cannot use this extension, try clicking Scan now button to check again.',
    videoAvailable: 'Extension can be used on this web page because there is video tag available. Write at what time you want your computer to shut down.',
    iframeAvailable: (onClick: CallbackFunction, hover: string | undefined) => (<div>
        This web page does not contain Video directly but does contain IFrame window
        <br />
        <div className='link' onClick={onClick} title={hover}>CLICK HERE TO NAVIGATE TO IT</div>
    </div>),
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
    readMore: (onClick: CallbackFunction) => (<>
        If you want to know why do you need to navigate to IFrame and much more, you should
        open our <span className='link' onClick={onClick}>FAQ document</span>.
    </>),
};

export const countdownComponentStrings = {
    notScheduledDesciption: 'Select time to shutdown your computer',
    scheduledString: (time: string) => <>Computer will shutdown in: <b>{time}</b></>,
};

export const timerComponentStrings = {
    description: (currentTime: React.ReactNode) => <div style={{ marginBottom: 5, textAlign: 'center' }}>
            Current time is {currentTime} select in what time you want your computer to shut down</div>,
    scheduled: () => <div style={{ marginTop: 15 }}>Shutdown scheduled at:</div>,
};

export const sportEndingsComponentStrings = {
    apiDisabled: () => <>placeholder description</>,
    usageInstructions: 'For this mode to work, first, you need to select a sporting event after the end' +
        ' of which you want your computer to shut down. Additionally, you can select delay in shutting down (if your broadcast is late)',
    noSportEvents: 'There are no sport events in play',
    selectSportEvent: 'Select sport event',
    sportShutdownScheduledAfterEnd: (matchLabel: React.ReactNode) =>
        <>Your computer will shut down when {matchLabel} game is finished.</>,
    sportShutdownWithDelayScheduled: (delayString: React.ReactNode, matchLabel: React.ReactNode) =>
        <>Your computer will shut down {delayString} after {matchLabel} game is finished.</>,
    noResults: 'No Results',
    loadingTime: 'Number of selected leagues affects loading time',
    failedFetch: 'Failed Fetch',
};

export const title = 'AUTO SHUTDOWN';
export const nativeAppTitle = 'shutdown.extension.host';

export const links = {
    docs: 'http://www.google.hr',
    nativeWin: 'http://bit.ly/shutdown-host',
    FAQ: 'http://bit.ly/shut-ex-faq',
};

export const hostNotActive = (onClick: CallbackFunction, faqOnClick: CallbackFunction) => (
    <div className={'flex-column no-host-message'}>
        <span>EXTENSION WILL NOT WORK!</span>
        <br />
        <span>You need to download and install native part of this extension in order to it working propperly</span>
        <br />
        <div className={'link'} onClick={onClick}>{links.nativeWin}</div>
        <br />
        <span> Read more on why do you need native part
            <span className={'link'} onClick={faqOnClick}>here.</span>
        </span>
    </div>
);

export const extensionWillNotWork = (faqOnClick: CallbackFunction) => (
    <>
        Extension <b>will not work</b> because the native part isn't found.
        <br />Read how to install the native part and much more
        <span className={'link'} onClick={faqOnClick}>here.</span>
    </>
);

export const actionResultsStrings = {
    scanNow: {
        nothingFound: 'Nothing found',
        iFrameFound: 'New IFrame found',
        videoFound: 'Video Found!',
        noChanges: 'No changes',
    },
    shutdown: {
        success: 'Success',
        failed: 'Failed',
        failedVideoDisappeared: 'Video you scheduled shutdown dissape disappeared',
        failedCountdown: 'Not supported less than 60 seconds',
        failedTimer: 'Cannot select date in the past',
        failedSport: 'Game is already finished',
    },
    cancel: {
        canceledInBackground: 'Tab was Closed and Shutdown is canceled',
        canceled: 'Canceled',
    },
    addSport: {
        saved: 'Changes saved',
    },
};

export const initialTime = '00:00:00';
export const initialDateTime = () => new Date().toString();
export const isPopupOpenWrapper = () => true; // chrome.extension.getViews({ type: 'popup' }).length > 0;
