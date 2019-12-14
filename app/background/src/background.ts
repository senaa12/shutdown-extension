  chrome.runtime.onMessage.addListener(function(message, sender, response) {
    console.log('background');
    console.log(message);

    // port = chrome.runtime.connectNative("sena.test.app");
    // port.postMessage({ "text": "sena,m"});
    // port.onMessage.addListener((resp) => { console.log(resp) })
  });
