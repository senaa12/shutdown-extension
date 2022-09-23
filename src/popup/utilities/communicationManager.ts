import { CallbackFunction, ChromeApiMessage } from 'common';

class CommunicationManager {
    public sendMessageToActiveTab(message: ChromeApiMessage, onReponse?: CallbackFunction) {
        chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
            if (tabs[0] && tabs[0].id) {
                if (!!onReponse) {
                    chrome.tabs.sendMessage(tabs[0].id, message, onReponse);
                }
                else {
                    chrome.tabs.sendMessage(tabs[0].id, message);
                }
            }
        });
    }

    public sendMessageToTab(tabID: number, message: ChromeApiMessage, onReponse?: CallbackFunction) {
        if (!!onReponse) {
            chrome.tabs.sendMessage(tabID, message, onReponse);
        }
        else {
            chrome.tabs.sendMessage(tabID, message);
        }
    }

    public sendMessageToBackgroundPage(message: ChromeApiMessage, onReponse?: CallbackFunction) {
        if (!!onReponse) {
            chrome.runtime.sendMessage(message, onReponse);
        }
        else {
            chrome.runtime.sendMessage(message)
        }
    }
}

const communication = new CommunicationManager();
export default communication;
