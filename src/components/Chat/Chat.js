import React, { useState, useEffect, useRef } from "react";
import Message from "./Message/Message";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserData } from "../../redux/reducers/authSlice";
import db from "../../firebase";
import "./Chat.css";
import UserInfo from "./UserInfo/UserInfo";
import { isUserOnline, timestampToLocalTime } from "../../utility";
import { onValue, ref, set, push, serverTimestamp } from "firebase/database";

import { Avatar, IconButton, Menu, MenuItem, Snackbar, CircularProgress} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MuiAlert from "@material-ui/lab/Alert";
import SendIcon from '@material-ui/icons/Send';
const calcMessageHashKey = (s1, s2) => {
  let messageHashKey = null;
  if (s1 < s2) {
    messageHashKey = s1 + s2;
  } else {
    messageHashKey = s2 + s1;
  }
  return messageHashKey;
};

const Chat = () => {
  const params = useParams();
  // console.log(params);
  const senderUserId = useParams().userId;
  // const roomId = useParams().roomId;
  const [messages, setMessages] = useState([]);
  const userData = useSelector(selectUserData);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);
  const [chatData, setChatData] = useState([]);
  const [anchorEl, setAnchorEl] = useState();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showError, setShowError] = useState("");
  const [loading, setLoading] = useState(false);

  let messageHashKey = null;
  if (senderUserId) {
    messageHashKey = calcMessageHashKey(userData.userId, senderUserId);
  }

  const getMessages = () => {
    if (!messageHashKey) return;
    setLoading(true);
    onValue(ref(db, "messages/" + messageHashKey),(snapshot) => {
      if(snapshot.exists()){
        let messages = [];
          Object.values(snapshot.val()).forEach((message) => {
            messages.push({
              type: message.type,
              message: message.message,
              author: message.authorName,
              timestamp: message.timestamp,
              authorId: message.authorId,
            });
          });
          setMessages(messages);
      }
      else {
        setMessages([]);
      }
        setLoading(false);
    })
  };

  const getSenderInfo = () => {
    onValue(ref(db, "users/" + senderUserId),(snapshot) => {
      setChatData({
        userId: snapshot.val().userId,
        userImg: snapshot.val().userImg,
        userEmail: snapshot.val().userEmail,
        userName: snapshot.val().userName,
        lastSeen: snapshot.val().lastSeen,
        online: isUserOnline(snapshot.val().lastSeen),
      });
    });
  };
  console.log(senderUserId);
  useEffect(() => {
    if (senderUserId) {
      getSenderInfo();
    }
    getMessages();
    setInput("");
  }, [senderUserId]);

  const sendMessageHandler = (event) => {
    event.preventDefault();
    if (messageHashKey) {
      push(ref(db, "messages/"+ messageHashKey),{
        authorId: userData.userId,
        authorName: userData.userName,
        message: input,
        timestamp: serverTimestamp(),
        type: "text",
      });
    }
    setInput("");
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    // if (params.userId == roomId) {
      scrollToBottom();
    // }
  }, [messages]);

  const closeMenuHandler = () => {
    setAnchorEl(null);
  };

  const showMenuHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const setUserInfoHandler = () => {
    closeMenuHandler();
    setShowUserInfo(true);
  };

  const closeUserInfo = () => {
    setShowUserInfo(false);
  };


  const handleClose = () => {
    setShowError("");
  };

  return (
    <>
      <Snackbar
        open={showError !== ""}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          onClose={handleClose}
          severity="error"
          elevation={6}
          variant="filled"
        >
          {showError}
        </MuiAlert>
      </Snackbar>

      <div className="Chat">
        <UserInfo
          show={showUserInfo}
          closeUserInfo={closeUserInfo}
          userName={chatData.userName}
          userEmail={chatData.userEmail}
          userId={chatData.userId}
          userImg={chatData.userImg}
        />
        <div className="Chat_Header">
          <div className="Chat_HeaderInfo">
            <Avatar
              onClick={setUserInfoHandler}
              src={chatData.userImg }
            />
            <div className="Chat_Info">
              <h3>{chatData.userName }</h3>
              <p>
                {chatData.online ? (
                  <>
                    <span>Online</span>
                    <span className="Online" />
                  </>
                ) : chatData.lastSeen ? (
                  "Last seen at " + timestampToLocalTime(chatData.lastSeen)
                ) : (
                  "Name"
                )}
              </p>
            </div>
          </div>
          <IconButton onClick={showMenuHandler} color="inherit">
            <MoreVertIcon />
          </IconButton>
          <Menu
            color="dark"
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            anchorPosition={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={Boolean(anchorEl)}
            onClose={closeMenuHandler}
          >
            <MenuItem onClick={setUserInfoHandler}>User Info</MenuItem>
          </Menu>
        </div>
        <div className="Chat_Body">
          {loading ? (
            <CircularProgress
              variant="indeterminate"
              thickness={2}
              size={100}
            />
          ) : (
            messages.map((message) => {
              return (
                <Message
                  key={message.timestamp}
                  message={message.message}
                  type={message.type}
                  videoURL={message.videoURL}
                  imgURL={message.imgURL}
                  author={message.author}
                  timestamp={message.timestamp}
                  currentUserId={userData.userId}
                  authorUserId={message.authorId}
                />
              );
            })
          )}
          <div ref={messageEndRef} />
        </div>
        <div className="Chat_Footer">
          
          <form onSubmit={sendMessageHandler}>
            <input
              onChange={(event) => setInput(event.target.value)}
              value={input}
              placeholder="Type a message"
              type="text"
            />
            <IconButton type="submit" color="inherit" style={{display:(input==="")?"none":"inline-flex",paddingBottom:"0px",paddingTop:"0px"}}>
              <SendIcon />
            </IconButton>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chat;
