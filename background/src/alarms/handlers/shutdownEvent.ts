import { shutdownCommand } from "../../utilities/nativeCommunication";
import { removeShutdownEvent } from "../../utilities/shutdown";

export const shutddownCommandWithIconChange = () => {
    removeShutdownEvent();
    shutdownCommand();
}