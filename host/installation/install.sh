#!/usr/bin/env bash

if [[ $EUID -ne 0 ]]; then 
	echo "Installer must be run as root" 
	exit 1 
fi

echo "Installation started"

MANIFEST_LOCATION="$HOME/.config/google-chrome/NativeMessagingHosts/"
MANIFEST_LOCATION_CHROMIUM="$HOME/.config/chromium/NativeMessagingHosts"
MANIFEST_NAME="shutdown.extension.host.json"
MANIFEST="$MANIFEST_LOCATION$MANIFEST_NAME"
MANIFEST_CHROMIUM="$MANIFEST_LOCATION_CHROMIUM$MANIFEST_NAME"
PROGRAM_LOCATION="$HOME/.config/chrome-auto-shutdown/"
PROGRAM_NAME="run.sh"
NODE_NAME="node"
PROGRAM="$PROGRAM_LOCATION$PROGRAM_NAME"

sudo mkdir -p "$MANIFEST_LOCATION"
sudo mkdir -p "$PROGRAM_LOCATION"

echo "Creating manifest for Google Chrome..."
echo '{' > "$MANIFEST"
echo '   "name": "shutdown.extension.host",' >> "$MANIFEST"
echo '   "description": "Chrome Shutdown-Extension native app.",' >> "$MANIFEST"
echo "   \"path\": \"$PROGRAM\"," >> "$MANIFEST"
echo '   "type": "stdio",' >> "$MANIFEST"
echo '   "allowed_origins": [' >> "$MANIFEST"
## you can change ID here with "chrome-extension://YOUR-ID-HERE/""
echo '    	 "chrome-extension://heanibacideokneklnfomdlokppmcaam/"' >> "$MANIFEST"
echo '   ]' >> "$MANIFEST"
echo '}' >> "$MANIFEST"

echo "Creating manifest for Chromium..."
echo '{' > "$MANIFEST_CHROMIUM"
echo '   "name": "shutdown.extension.host",' >> "$MANIFEST_CHROMIUM"
echo '   "description": "Chrome Shutdown-Extension native app.",' >> "$MANIFEST_CHROMIUM"
echo "   \"path\": \"$PROGRAM\"," >> "$MANIFEST_CHROMIUM"
echo '   "type": "stdio",' >> "$MANIFEST_CHROMIUM"
echo '   "allowed_origins": [' >> "$MANIFEST_CHROMIUM"
## you can change ID here with "chrome-extension://YOUR-ID-HERE/""
echo '    	 "chrome-extension://heanibacideokneklnfomdlokppmcaam/"' >> "$MANIFEST_CHROMIUM"
echo '   ]' >> "$MANIFEST_CHROMIUM"
echo '}' >> "$MANIFEST_CHROMIUM"

echo "Copying host..."
cp ./host.js "$PROGRAM_LOCATION"

echo "#!/usr/bin/env bash" > "$PROGRAM"
if which node > /dev/null
    then
        echo "Node is installed, skipping..."
	    echo "node host.js" >> "$PROGRAM"

    else
        echo "Using installer node..."
	    echo "./node host.js" >> "$PROGRAM"

	    MACHINE_TYPE=`uname -m`
        if [ ${MACHINE_TYPE} == 'x86_64' ]; then
            cp ./node-64 "$PROGRAM_LOCATION$NODE_NAME"
        else
            cp ./node-86 "$PROGRAM_LOCATION$NODE_NAME"
        fi
        sudo chmod +x "$PROGRAM_LOCATION$NODE_NAME"
    fi
sudo chmod +x "$PROGRAM"
echo "Finished, host is installed at $PROGRAM_LOCATION"
