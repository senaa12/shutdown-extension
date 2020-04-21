# Chrome Shutdown Extension

Browser extension project for automatic shutdown; contains host (native) application and app (extension part).

Chrome Web Store: [http://chrome.google.com/webstore/detail/auto-shutdown-extension/heanibacideokneklnfomdlokppmcaam](http://chrome.google.com/webstore/detail/auto-shutdown-extension/heanibacideokneklnfomdlokppmcaam)

## Project structure

**Extension part:** four Typescript projects => Chrome Extension

* **background** - contains code for background page, Redux store, Native communication, tabs manipulation, Countdown and Timer shutdown events handler etc.
* **common** - common project for extension part, models and interfaces used in extension, has `common` allias defined so you can use it everywhere
* **content-script** - content script project, contains video detection code and Video Player shutdown event handler
* **popup** - standard Reactjs application
* **resources** - manifest and icons

**Host app:** Typescript Nodejs native application used to execute system (in this case, shutdown) commands

* **deprecated** - old C++ native host
* **installation** - installation scripts, naming per system

     *Windows* - installs native application at `%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\` and registrates extension at `HKEY_CURRENT_USER/Software/Google/Chrome/NativeMessagingHosts/shutdown.extension.host`.
     
     *Linux* - installs native application at `$HOME/.config/chrome-auto-shutdown` and registrants extension at `$HOME/.config/google-chrome/NativeMessagingHosts/shutdown.extension.host.json` for usage on Google Chrome and `$HOME/.config/chromium/NativeMessagingHosts/shutdown.extension.host.json` for Chromium (**IMPORTANT** extension sometimes does not work properly).

* **src** - complete native client code

**Common** - common project for Native host and extension, interfaces for Native Messaging, for extension alias `common-host` is used and for Native `common`. 

## Installation

Extension and native are two different projects, they have separate `package.json` files so you need to install dependencies separately with:

```
npm install
```

as well as building projects with:

```
npm run build
```

The project builds in own `root/public` folder. The extension has several other build scripts so you can build each project separately, for example: `npm run build-background` build background page.

**NOTE:** You need to have Nodejs installed for the native host to work.

## STARTING PROJECT

To start extension, open your Google Chrome and navigate to `chrome://extensions/`, enable developer mode (top right corner) and click on `Load unpacked` button. When the popup opens, navigate to `//app/public` (the folder where extension build is located) and click `Select folder`. The extension should appear on the screen. **Remember the ID** field on Auto Shutdown Extension tile.

To install the native part first you need to place install script and build an application in the same folder. Than open install script in some editor replace extension ID (line above is commented to highlight where change needs to be made) with the ID you remembered (the one on `chrome://extensions/`). That is all next you just need to run the install script.

## FAQ

See the [FAQ](FAQ.md) document.
