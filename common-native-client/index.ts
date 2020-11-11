// Common for all personal extensions
// This file needs to be copied in everyone using native client
// contains models common for app part (extension) and host part (native application)

export enum NativeMessageTypeEnum {
    Echo,
    ExecuteCommand,
}

export interface NativeMessageBase {
    type: NativeMessageTypeEnum;
}

export interface NativeMessagePayloadMapper {
    [NativeMessageTypeEnum.Echo]: any;
    [NativeMessageTypeEnum.ExecuteCommand]: string;
}

export interface NativeMessageTypings<P extends {}, T extends keyof P> {
    type: T;
    data: P[T];
}

export declare type NativeMessage =
    NativeMessageTypings<NativeMessagePayloadMapper, NativeMessageTypeEnum.Echo> |
    NativeMessageTypings<NativeMessagePayloadMapper, NativeMessageTypeEnum.ExecuteCommand>;

export declare type Push = (mess: NativeMessage) => void;
export declare type Done = () => void;
