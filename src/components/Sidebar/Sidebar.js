import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import db from "../../firebase";
import "./Sidebar.css";
import { LOGOUT, selectUserData } from "../../redux/reducers/authSlice";
import AddUserModal from "./SidebarModals/AddUserModal";
import Profile from "../Profile/Profile";
import { isUserOnline } from "../../utility";
import { onValue, ref, get, push, set } from "firebase/database";
import GroupRoundedIcon from "@material-ui/icons/GroupRounded";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  CircularProgress,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SidebarChat from "./SidebarChat/SidebarChat";

const calcMessageHashKey = (s1, s2) => {
  let messageHashKey = null;
  if (s1 < s2) {
    messageHashKey = s1 + s2;
  } else {
    messageHashKey = s2 + s1;
  }
  return messageHashKey;
};

const Sidebar = ({ update }) => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const [userList, setUserList] = useState({});

  console.log(userList);
  const [anchorEl, setAnchorEl] = useState();
  const [userContactList, setUserContactList] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showError, setShowError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [usersLastUpdate, setUsersLastUpdate] = useState({});
  const [usersLoading, setUsersLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState("");
  const [input, setInput] = useState("");

  const showMenuHandler = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenuHandler = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    closeMenuHandler();
    dispatch(LOGOUT());
  };

  const getUserDetails = () => {
    if (userData.userId) {
      console.log("here");
      let users = [];
      setUsersLoading(true);
      onValue(
        ref(db, "users/" + userData.userId + "/contactList"),
        async (snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            users = Object.values(snapshot.val());
            console.log(users);
            if (users.length === 0) {
              setUsersLoading(false);
              return;
            }
            let userContacts = [];
            for (let user of users) {
              console.log(user);
              let userInfo = {};
              await get(ref(db, "users/" + user)).then((snapshot2) => {
                console.log(snapshot2.val());
                userInfo = snapshot2.val();
              });
              let lastMessage = "";
              await get(
                ref(db, "messages" + calcMessageHashKey(user, userData.userId))
              ).then((snapshot3) => {
                if (snapshot3.exists()) {
                  let messageResponse = Object.values(snapshot3.val()).slice(
                    -1
                  );
                  if (messageResponse.type === "text") {
                    lastMessage = messageResponse.message;
                  }
                }
              });
              userContacts.push(
                {
                  userId: userInfo.userId,
                  userName: userInfo.userName,
                  userEmail: userInfo.userEmail,
                  userImg: userInfo.userImg,
                  lastMessage,
                }
              )
            }
            setUserContactList(userContacts);
            setUsersLoading(false);
            // console.log(userInfo);
          } else {
            setUsersLoading(false);
            setUserContactList([]);
          } 
        }
      );
    }
  };

  // Checking real time status of other users
  useEffect(() => {
    if (userContactList) {
      userContactList.forEach((user) => {
        onValue(ref(db, "users/" + user.userId), (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          setUsersLastUpdate((prevState) => {
            return {
              ...prevState,
              [user.userId]: {
                lastSeen: data.lastSeen,
                online: isUserOnline(data.lastSeen),
              },
            };
          });
        });
      });
    }
  }, [userContactList, update]);

  useEffect(() => {
    // List of all users
    get(ref(db, "/users"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          setUserList(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    getUserDetails();
  }, []);

  const addUser = () => {
    closeMenuHandler();
    setShowAddUser(true);
  };

  const closeAllModals = () => {
    setShowAddUser(false);
  };

  const addUserHandler = (userId) => {
    if (userId === "" || userId === userData.userId) {
      setShowError("Invalid userID");
      return;
    }
    get(ref(db, "users/" + userId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          push(ref(db, "users/" + userId + "/contactList"), userData.userId);
          push(ref(db, "users/" + userData.userId + "/contactList"), userId);
          set(
            ref(db, "/messages/" + calcMessageHashKey(userData.userId, userId)),
            {}
          );
        } else {
          setShowError("userID doesn't Exists");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClose = () => {
    setShowError("");
    setShowSuccess("");
  };

  const showProfileHandler = () => {
    closeMenuHandler();
    setShowProfile(true);
  };

  return (
    <>
      <AddUserModal
        show={showAddUser}
        closeModal={closeAllModals}
        addUserHandler={addUserHandler}
      />
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
      <Snackbar
        open={showSuccess !== ""}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <MuiAlert
          onClose={handleClose}
          severity="success"
          elevation={6}
          variant="filled"
        >
          {showSuccess}
        </MuiAlert>
      </Snackbar>
      <div className="Sidebar">
        <Profile
          show={showProfile}
          userId={userData.userId}
          userEmail={userData.userEmail}
          imgURL={userData.userImg}
          userName={userData.userName}
          closeProfile={() => setShowProfile(false)}
        ></Profile>
        <div className="Sidebar_Header">
          <div className="Sidebar_HeaderInfo">
            {/* {userData.userImg} */}
            <Avatar onClick={showProfileHandler} src={userData.userImg}>
              <GroupRoundedIcon />
            </Avatar>
            <h3>{userData.userName}</h3>
          </div>
          <div className="Sidebar_Tools">
            <IconButton onClick={showMenuHandler}>
              <MoreVertIcon />
            </IconButton>
            <Menu
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
              <MenuItem onClick={showProfileHandler}>Profile</MenuItem>
              <MenuItem onClick={addUser}>Add Contact</MenuItem>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </Menu>
          </div>
        </div>

        <div className="Sidebar_Search">
          <div className="Sidebar_SearchContainer">
            <IconButton color="inherit">
              <SearchOutlinedIcon />
            </IconButton>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search or start new chat"
              type="text"
            />
          </div>
        </div>

        <div className="Sidebar_Chat">
          {usersLoading ? (
            <CircularProgress />
          ) : (
            <>
              {userContactList.map((user) => {
                if (!new RegExp(input, "i").test(user.userName)) {
                  return null;
                }
                return (
                  <SidebarChat
                    key={user.userId}
                    Name={user.userName}
                    Id={user.userId}
                    Img={user.userImg}
                    Email={user.email}
                    lastMessage={user.lastMessage}
                    online={usersLastUpdate[user.userId]?.online}
                    lastSeen={usersLastUpdate[user.userId]?.lastSeen}
                    type="user"
                  />
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
