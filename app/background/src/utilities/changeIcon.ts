
export const changeIcon = (shutdownIcon: boolean) => {
    if (shutdownIcon) {
        chrome.browserAction.setIcon({ path: '/icon-shutdown.png' });
    } else {
        chrome.browserAction.setIcon({ path: '/icon.png' });
    }
};
