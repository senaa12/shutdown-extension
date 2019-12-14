class ContentScriptMessaging {
    public sendMessageToActiveTab(message) {
        // chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        //     chrome.tabs.sendMessage(tabs[0].id, message);
        // });
    }
}

const messanger = new ContentScriptMessaging();
export default messanger;
