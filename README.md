# Chrome Shutdown Extension

Browser extension project for automatic shutdown.

![Capture](./screenshot.PNG)

## Installation

Chrome Web Store: [http://chrome.google.com/webstore/detail/auto-shutdown-extension/heanibacideokneklnfomdlokppmcaam](http://chrome.google.com/webstore/detail/auto-shutdown-extension/heanibacideokneklnfomdlokppmcaam)

## Getting started

First you need to install dependencies with:

```
npm install
```

and build project with:

```
npm run build
```

The project builds in own `root/public` folder. The extension has several other build scripts so you can build each Chrome extension project separately, for example: `npm run build-background` builds background page.

To start extension, open your Google Chrome and navigate to `chrome://extensions/`, enable developer mode (top right corner) and click on `Load unpacked` button. When the popup opens, navigate to `//public` (the folder where extension build is located) and click `Select folder`. The extension should appear on the screen. **Remember the ID** field on Auto Shutdown Extension tile which should appear if the extension is loaded successfully.

The native client for this extension is [here](https://github.com/senaa12/native-client.git).

**NOTE:** You need to have Nodejs installed for the native client to work.

## Project structure

* **background** - contains code for background page, Redux store, Native communication, tabs manipulation, Countdown and Timer shutdown events handler etc.
* **common** - common project for extension part, models and interfaces used in extension, has `common` allias defined so you can use it everywhere
* **common-native-client** - common project for Native client and extension, interfaces for Native Messaging, for extension alias `common-host` is used and for Native `common`. 
* **content-script** - content script project, contains video detection code and Video Player shutdown event handler
* **popup** - standard Reactjs application
* **resources** - manifest and icons

## FAQ

See the [FAQ](FAQ.md) document.
