# FAQ

1. What is Shutdown Extension?

Shutdown Extension is a small browser Extension used for automatic computer shutdown. For now, it has 2 modes: Countdown and Timer and the third one that is in progress Video Player mode. Also for now, it only works for Windows users.

2. How does it work?

Shutdown Extension triggers the native part that executes shutdown command located `c:\\windows\\system32\\shutdown` used to shutdown your PC.

3. Why do I need the native part to run this extension?

You need the native part that is installed on your local computer because the browser cannot execute system commands from itself.

4. How do I install the native part?

First, you need to download the native part from [http://bit.ly/shutdown-host](http://bit.ly/shutdown-host). That zip file contains an install script and executable file that represents the native part of your application. To install it just **run as administrator** the `install.bat` file. Installer will install your extension in `c:\\Users\{user}\AppData\Local\Chrome-Shutdown-Extension-Host`.

5. What does it mean to install the native part and why do I need to run an installation as administrator?

It means creating the manifest file in the installation folder, copying the executable file to it and register the manifest file path to your registry. Because it changes your registery (inserts one key/value pair that specifies where a manifest file from the native part is located) you also need to run it as administrator.

6. Why do I need to navigate to IFrame when detecting video on specific sites?

