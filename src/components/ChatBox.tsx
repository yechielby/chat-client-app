import { FC, useContext, useState } from "react";
import SocketContext, { IMessage } from "../contexts/Socket/Contex";
import ChatMessageComponent from "./ChatMessage";
import './ChatBox.scss';

const ChatBoxComponent: FC = (props) => {

  const { userId, users, messages, socket } = useContext(SocketContext).SocketState;

  console.log(`Socket ID: ${socket?.id}`);

  const [text, setText] = useState('');
  const SendMessage = () => {

    const regexp = new RegExp('^[A-Za-z0-9 .,!?]+$');
    if (regexp.test(text)) {
      console.info('Sending new messag to server ...');
      socket?.emit('new_message', text);
    } else {
      alert('No special characters in the message, please!')
    }
    setText('');
  }

  return (
    <div className="box" >
      <div className="chat-header">
        {'users online: ' + users.length}
      </div>
      <div className="chat-content">
        {messages
          .map((m) => (
            <ChatMessageComponent message={m} isUserOnline={!!users.includes(m.uid.toString())} isOwner={m.uid === +userId}></ChatMessageComponent>
          ))}
      </div>
      <div className="send-box">
        <button disabled={!text.length} onClick={() => SendMessage()}>Send</button>
        <input type="text" name="text" id="text" value={text}
          onChange={(e) => { setText(e.target.value); }} />
      </div>
    </div>
  );
}


export default ChatBoxComponent;
