export interface ContentScriptMessage {
    type: ContentScriptMessageTypeEnum;
    data?: any;
}

export enum ContentScriptMessageTypeEnum {
    SubscribeToVideoEnd,
}

export interface MessageSender {
    id: string;
}

export type CallbackFunction = (data: any) => void;

export enum ResponseType {
    Success,
    Failed,
}
