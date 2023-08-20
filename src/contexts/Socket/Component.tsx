import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { IMessage, SocketContextProvider, SocketReducer, defaultSocketContextState } from "./Contex";
import { useSocket } from '../../Hooks/useSocket';
import LoginComponent from '../../components/Login';

export interface ISockrtContextComponentProps extends PropsWithChildren { }

const SocketContextComponent: React.FC<ISockrtContextComponentProps> = (props) => {
    const { children } = props;

    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);

    const serverHostname = "18.130.180.190";

    const socket = useSocket(`ws://${serverHostname}/`, {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false
    });

    useEffect(() => {
        if (SocketState.nickname.length > 0) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: SocketState.nickname })
            };
            fetch(`http://${serverHostname}/user/login`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.result) {
                        const user = data.result[0];
                        SocketDispatch({ type: 'update_userId', payload: `${user.id}`});
                    } else if (data.message) {
                        alert(data.message);
                        SocketDispatch({ type: 'update_nickname', payload: '' });
                    }
                })
                .catch((e) => {
                    console.log(e)
                    SocketDispatch({ type: 'update_nickname', payload: '' });
                });
        }
        // eslint-disable-next-line
    }, [SocketState.nickname]);

    useEffect(() => {
        console.log('SocketState.userId', SocketState.userId);
        if (Number(SocketState.userId)) {

            /** Connect to web socket */
            socket.connect();

            /** Save the socket in context */
            SocketDispatch({ type: 'update_socket', payload: socket });

            /** start the event listener */
            StartListeners();

            /** Send the handshake */
            SendHandshake();
        }
        // eslint-disable-next-line
    }, [SocketState.userId]);

    const StartListeners = () => {
        /** connect event */
        socket.on('user_connected', (users: string[]) => {
            console.info('User connected, new user list received',users);
            SocketDispatch({ type: 'update_users', payload: users });
        });

        /** Reconnect event */
        socket.on('user_disconnected', (userId: string) => {
            console.info('User disconnected');
            SocketDispatch({ type: 'remove_user', payload: userId });
        });

        /** get messages event */
        socket.on('get_messages', (messages: IMessage[]) => {
            console.info('User disconnected');
            SocketDispatch({ type: 'update_messages', payload: messages });
        });

        /** Reconnect event */
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt:' + attempt);
        });

        /** Reconnect attempt event */
        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnected attempt:' + attempt);
        });

        /** Reconnection error */
        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnected error:' + error);
        });

        /** Reconnection failed */
        socket.io.on('reconnect_failed', () => {
            console.info('Reconnection failure');
            alert('We are unable to connect ypu to the web socket.');
        });

    }
    const SendHandshake = () => {
        console.info('Sending Handshake to server ...');

        socket.emit('handshake', SocketState.userId, (userId: string, users: string[]) => {
            console.log('user handshake callback message received');
            SocketDispatch({ type: 'update_userId', payload: userId });
            SocketDispatch({ type: 'update_users', payload: users });

            setLoading(false);
        });
    }

    const handleLogin = (name: string) => {
        SocketDispatch({ type: 'update_nickname', payload: name });
    }
    if (!SocketState.nickname.length) {
        return <LoginComponent handleOnClickLogin={handleLogin}></LoginComponent>
    }

    if (loading) return <p>Loading socket IO ...</p>;

    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>

}
export default SocketContextComponent;