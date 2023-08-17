import { time } from "console";
import React, { createContext } from "react";
import { Socket } from "socket.io-client";

export interface IMessage {
    id: number;
    uid: number;
    uname: string;
    message: string;
    createdAt: Date;
}
export interface ISocketContextState {
    socket: Socket | undefined;
    nickname: string;
    userId: string;
    users: string[];
    messages: IMessage[];
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    nickname: '',
    userId: '',
    users: [],
    messages: []
};

export type TSocketContextAction = 'update_socket' | 'update_nickname' | 'update_userId' | 'update_users' | 'remove_user' | 'update_messages';

export type TSocketContextPayload = string | string[] | IMessage[] |  Socket;

export interface ISocketContextAction {
    type: TSocketContextAction;
    payload: TSocketContextPayload;
}
export const SocketReducer = (state: ISocketContextState, action: ISocketContextAction) => {
    console.log(`Massage Received - Action: ${action.type} - Payload: `, action.payload);

    switch (action.type) {
        case 'update_socket':
            return { ...state, socket: action.payload as Socket };
        case 'update_nickname':
            return { ...state, nickname: action.payload as string };
        case 'update_userId':
            return { ...state, userId: action.payload as string };
        case 'update_users':
            return { ...state, users: action.payload as string[] };
        case 'remove_user':
            return { ...state, users: state.users.filter((userId) => userId !== (action.payload as string)) };
        case 'update_messages':
            return { ...state, messages: action.payload as IMessage[] };
        default:
            return { ...state };
    }
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextAction>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => { }
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;