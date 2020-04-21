# FAQ

* What is Shutdown Extension?

Shutdown Extension is a small browser Extension used for automatic computer shutdown. It has 3 modes: Video Player mode, Countdown and Timer. Video Player mode enables you to shut down your computer at the specific point in the video, with countdown you can select the time to count down from and the timer is for scheduling shutdown in the specific time. For now, the extension only works on Windows computers.

* How shutting down works?

Shutdown Extension triggers the native part of the extension that executes a command to shut down the computer. Command depends on the system:

   *Windows* - `shutdown /s /f /t 0`
   
   *Linux* - `shutdown -h now`

* Why do I need the native part to run this extension?

You need the native part installed on your local computer because the browser cannot execute system commands from itself.

* **How do I install the native part?**

First, you need to download the native part:

   *Windows* - [http://bit.ly/shutdown-host](http://bit.ly/shutdown-host)

   *Linux* - [http://bit.ly/shutdown-host-linux](http://bit.ly/shutdown-host-linux)

Extract everything from the downloaded file in the same folder and just run the install script.

* What installation does?

It creates the manifest file and runs the script, copies Nodejs build (if the Nodejs is not installed on the host machine) `host.js` file (the actual native application). The native application is installed:

   *Windows* - `%LOCALAPPDATA%\Chrome-Shutdown-Extension-Host\`

   *Linux* - `$HOME/.config/chrome-auto-shutdown`

* Why do I need to run the installation as administrator on Windows?

Because it changes your Registry (inserts one key/value pair that specifies where a manifest file from the native part is located) you need to run it as administrator.

* Why do I need to navigate to IFrame when detecting video on specific sites?

Some video streaming web sites do not want to expose video player directly or they don't have so they do it over IFrames. IFrame (or Inline Frame) is an HTML document embedded inside another HTML document (basically web page inside a web page); it is often used to insert content from another source. So basically if the video player is inside IFrame, it is located on a totally different address and javascript cannot reach it, that is why you have to navigate to the Iframe source when using Video Player mode.
