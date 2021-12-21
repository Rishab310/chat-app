import React from 'react';
// import ReactPlayer from 'react-player'
import './Message.css';
import { timestampToLocalTime } from '../../../utility';

const Message = ({message, type, timestamp, author, currentUserId, authorUserId, imgURL, videoURL}) => {
    let displayOutput = null;
    if (type === "text") {
        displayOutput = (
            <p className={"Message " + (currentUserId === authorUserId ? "Message_Received" : "")}>
                <span className="Message_Author">{author}</span>
                    {message}
                <span className="Message_Time">{timestampToLocalTime(timestamp)}</span>
            </p>
        )
    }

    return displayOutput;
}

export default Message;