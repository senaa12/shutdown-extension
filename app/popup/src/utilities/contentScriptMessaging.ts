import { CallbackFunction, ContentScriptMessage } from 'common';

class ContentScriptMessaging {
    public sendMessageToActiveTab(message: ContentScriptMessage, onReponse?: CallbackFunction) {
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            if (tabs[0] && tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, message, onReponse);
            }
        });
    }

    public sendMessageToTab(tabID: number, message: ContentScriptMessage, onReponse?: CallbackFunction) {
        chrome.tabs.sendMessage(tabID, message, onReponse);
    }
}

const messanger = new ContentScriptMessaging();
export default messanger;
