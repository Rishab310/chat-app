import React from "react";
import { Link, useParams } from "react-router-dom";
import "./SidebarChat.css";

import { Avatar } from "@material-ui/core";
import { timestampToLocalTime } from "../../../utility";

const SidebarChat = ({
  Name,
  Img,
  Id,
  type,
  lastSeen,
  lastMessage,
  online,
}) => {
  const currentUserId = useParams().userId;
  // console.log(lastMessage);
  const sidebarChat = (
    <div className="SidebarChat">
      <Avatar src={Img} style={{fontSize:"10px"}} />
      <div className="SidebarChat_Info">
        <div className="SidebarChat_Contact">
          <h3>{Name}</h3>
          <p>{lastMessage}</p>
        </div>
        <div className="SidebarChat_Lastseen">
          {!online ? (
            <p>{timestampToLocalTime(lastSeen)}</p>
          ) : (
            <p>
              <span>Online</span>
              <span className="Online" />
            </p>
          )}
        </div>
      </div>
    </div>
  );
  let displayOutput = sidebarChat;

  if (currentUserId !== Id) {
    displayOutput = <Link to={"/user/" + Id}>{sidebarChat}</Link>;
  }
  return displayOutput;
};

export default SidebarChat;
