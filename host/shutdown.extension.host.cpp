#include <iostream>
#include <string>

void sendMessage(std::string);

int main(){
    while (1){
        unsigned int length = 0;

        //read the first four bytes (=> Length)
        for (int i = 0; i < 4; i++)
        {
            unsigned int read_char = getchar();
            length = length | (read_char << i*8);
        }

        //read the json-message
        std::string msg = "";
        for (int i = 0; i < length; i++)
        {
            msg += getchar();
        }

        std::string message = "{\"text\":\"This is a response message\"}";


        // Now we can output our message
        if (msg == "{\"text\":\"#PING#\"}"){
            message = "{\"isActive\":\"true\"}";
            
            sendMessage(message);
            break;
        }
        else if (msg == "{\"text\":\"#SHUTDOWN#\"}") {
        	system("c:\\windows\\system32\\shutdown /s /t 1 /f \n\n");

		}
		else {
			message = "{\"text\":\"You need to define reciever.\"}";
			sendMessage(message);	
		}
    }

    return 0;
}

void sendMessage(std::string message) {
	unsigned int len = message.length();
        	
    std::cout   << char(len>>0)
                << char(len>>8)
                << char(len>>16)
                << char(len>>24);

    std::cout << message << std::flush;
}
