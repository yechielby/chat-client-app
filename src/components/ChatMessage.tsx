import { FC } from "react";
import { IMessage } from "../contexts/Socket/Contex";
import './ChatMessage.scss';

export interface IChatMessageProps {
  message: IMessage;
  isUserOnline: boolean;
  isOwner: boolean;
}
const ChatMessageComponent: FC<IChatMessageProps> = (props) => {
  const { message, isUserOnline, isOwner } = props;
  return (
    <div className={`message  ${isOwner ? "order-left" : "order-right"}`}>
      <div className="avatar">
        <span className="username">{message.uname.substring(0, 2).toUpperCase()}</span>
        {(isUserOnline) && (<span className="user-status-online"></span>)}
      </div>
      <div className="text">
        <span className="text-xs">
          {message.uname}&nbsp;-&nbsp;
          {new Date(message.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
        <span className="text-md">{message.message}</span>
      </div>
    </div>
  );
}

export default ChatMessageComponent;
