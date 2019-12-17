import * as React from 'react';

const activeTabReader: React.FC = (props) => {
    const [currentTab, setCurrentTab] = React.useState<undefined | number>(undefined);
    chrome.tabs.getSelected((tab) => setCurrentTab(tab.id));

    if (!currentTab) {
        return <div>loading</div>;
    }

    const clonedChildren = React.cloneElement(props.children as React.ReactElement<any>, { currentTabId: currentTab });

    return <>{clonedChildren}</>;
};

export default activeTabReader;
