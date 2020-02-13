# FAQ

* What is Shutdown Extension?

Shutdown Extension is a small browser Extension used for automatic computer shutdown. It has 3 modes: Video Player mode, Countdown and Timer. For now, extension only works on Windows computers.

* How shutting down works?

Shutdown Extension triggers the native part of the extension that executes shutdown command located `c:\\windows\\system32\\shutdown` used to shutdown your PC.

* Why do I need the native part to run this extension?

You need the native part installed on your local computer because the browser cannot execute system commands from itself.

* How do I install the native part?

First, you need to download the native part from [http://bit.ly/shutdown-host](http://bit.ly/shutdown-host). That zip file contains an install script and executable file that represents the native part of your application. To install it just **run as administrator** the `install.bat` file. Installer will install your extension in `c:\\Users\{user}\AppData\Local\Chrome-Shutdown-Extension-Host`.

* What does it mean to install the native part and why do I need to run an installation as administrator?

It means creating the manifest file in the installation folder, copying the executable file to it and register the manifest file path to your registry. Because it changes your registery (inserts one key/value pair that specifies where a manifest file from the native part is located) you also need to run it as administrator.

* Why do I need to navigate to IFrame when detecting video on specific sites?

Some video streaming web sites do not want to expose video player directly or they don't have so they do it over IFrames. IFrame (or Inline Frame) is an HTML document embedded inside another HTML document, it is ofthen used to insert content from another source. So basically if video player is inside IFrame it is located on totaly different document and javascript cannot reach it because of same origin policy. That is why you need to navigate to IFrame source.
