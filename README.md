# Chrome Shutdown Extension

Browser extension project for automatic shutdown; contains host (native) application and app (extension part).

## Project structure

**Extension part:**

* **background** - contains code for background page from extension, contains Redux store
* **common** - common project, has alias `common` in every webpack configuration so you can use it's where ever you want
* **content-script** - content script project, has video detection inside, it is only used for premium version of application
* **popup** - **MAIN** project, React application, responsible for coping right items from resources folder to build folder `/public`
* **resources** - manifests and icons needed for application

**Host app:**

* **install.bat** - installation script current installation location is `%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\` **important!** every time you update application allowed origins inside script needs to change otherwise extension won't work. Native part is installed by inserting new key/value pair in registery in `HKEY_CURRENT_USER/Software/Google/Chrome/NativeMessagingHosts`. Where key is name of the extension native part, and value is path to manifest file from native part; here everything for installation is handeled inside this little script.

* **shutdown.extension.host** - `.exe` and `.cpp` of native application, in production `.exe` file is copied to installation location

## Installation

When navigation to `app` folder you need to install all dependencies with 

```
npm install
```

There are several build scripts but for dev purposes run 

```
npm run build
```

## Chrome Web Store Description

You want to shutdown you computer automatically?
This is a chrome extension for you. Extremely easy to use, you have available options like: 


* Timed shutdown - at specific time
* Countdown shutdown - time to count down
* Video player - In progress, schedule shutdown at specific point of video

NOTE: for now extension only works on Windows.
