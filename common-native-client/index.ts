// Common for all personal extensions
// This file needs to be copied in everyone using native client
// contains models common for app part (extension) and host part (native application)

export enum NativeMessageTypeEnum {
    Echo = 'ECHO',
    ExecuteCommand = 'EXECUTE_COMMAND',
}

export interface NativeMessagePayloadMapper {
    [NativeMessageTypeEnum.Echo]: any;
    [NativeMessageTypeEnum.ExecuteCommand]: string;
}

export interface NativeMessageTypings<T extends keyof NativeMessagePayloadMapper> {
    type: T;
    data: NativeMessagePayloadMapper[T];
}

export declare type NativeMessage =
    NativeMessageTypings<NativeMessageTypeEnum.Echo> |
    NativeMessageTypings<NativeMessageTypeEnum.ExecuteCommand>;

export declare type Push = (mess: NativeMessage) => void;
export declare type Done = () => void;
