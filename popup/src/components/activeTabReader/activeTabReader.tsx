import * as React from 'react';
import LoadingComponent from '../reusableComponents/loadingComponent';

export interface ActiveTabReaderInjectedProps {
    currentTabId?: number;
}

const activeTabReader: React.FunctionComponent<React.PropsWithChildren<object>> = (props) => {
    const [currentTab, setCurrentTab] = React.useState<undefined | number>(undefined);
    chrome.tabs.query({active: true}, (tab) => setCurrentTab(tab[0]?.id));

    if (!currentTab) {
        return <LoadingComponent />;
    }

    const clonedChildren = React.cloneElement(props.children as React.ReactElement<ActiveTabReaderInjectedProps>,
        { currentTabId: currentTab });

    return <>{clonedChildren}</>;
};

export default activeTabReader;
