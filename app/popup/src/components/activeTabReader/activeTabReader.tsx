import * as React from 'react';
import LoadingComponent from '../reusableComponents/loadingComponent';

export interface ActiveTabReaderInjectedProps {
    currentTabId?: number;
}

const activeTabReader: React.FC = (props) => {
    const [currentTab, setCurrentTab] = React.useState<undefined | number>(undefined);
    chrome.tabs.getSelected((tab) => setCurrentTab(tab.id));

    if (!currentTab) {
        return <LoadingComponent />;
    }

    const clonedChildren = React.cloneElement(props.children as React.ReactElement<ActiveTabReaderInjectedProps>,
        { currentTabId: currentTab });

    return <>{clonedChildren}</>;
};

export default activeTabReader;
