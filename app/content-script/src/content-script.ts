const register = () => {
    console.log('sena m');
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    console.log(sender);
    console.log(sendResponse);
    chrome.runtime.sendMessage({ mess: request });

    // const sena = document.getElementsByTagName('video')[0];
    // console.log(sena);

    // const getTime = () => {
    //     console.log(sena.currentTime);
    //     console.log(sena.duration);
    // }

    // setInterval(getTime, 2000)

    // sena.addEventListener('pause', function(e){
    //     console.log("pauza se desila")
    //     console.log(e)
    // })

    // chrome.runtime.sendMessage({ mess: "sena m "});
});