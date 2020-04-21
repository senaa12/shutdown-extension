// contains models common for app part (extension) and host part (native application)

export enum NativeMessageTypeEnum {
    Echo, 
    ExecuteCommand
}

export interface NativeMessageBase {
    type: NativeMessageTypeEnum;
}

export interface EchoNativeMessage extends NativeMessageBase {
    type: NativeMessageTypeEnum.Echo;
    data: any;
}

export interface ExecuteCommandNativeMessage extends NativeMessageBase {
    type: NativeMessageTypeEnum.ExecuteCommand;
    command: string;
}

export declare type NativeMessage = EchoNativeMessage & ExecuteCommandNativeMessage;
export declare type Push = (mess: NativeMessage) => void;
export declare type Done = () => void;
