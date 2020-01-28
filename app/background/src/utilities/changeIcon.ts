
export const changeIcon = (shutdownIcon: boolean) => {
    if (shutdownIcon) {
        chrome.browserAction.setIcon({ path: '/logo-16-shutdown.png' });
    } else {
        chrome.browserAction.setIcon({ path: '/logo-16.png' });
    }
};
