import React from "react";

export default function App() {
    const [tabs, setTabs] = React.useState(null);
    // React.useEffect(() => {
    //     chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    //         console.log(tabs)
    //         chrome.tabs.sendMessage(tabs[0].id, 'check');
    //     });
    // }, []);

    const test = () => {
        console.log("test")
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, 'check');
        });
    }

    return(
        <div>
            {tabs && tabs.map(t => <>{t.toString()}</>)}
            <button className="check" onClick={test}>Check for videos on page.</button>
        </div>
    )
}