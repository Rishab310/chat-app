import React, { useState, useEffect } from 'react';
import { IconButton, Avatar } from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Backdrop from '../../UI/Backdrop/Backdrop';
import './UserInfo.css';
import db from '../../../firebase';

const UserInfo = ({show, closeUserInfo, userImg, userName, userEmail, userId}) => {
    const [closing, setClosing] = useState(false);
    const [members, setMembers] = useState([]);

    const closeUserInfoHandler = () => {
        setClosing(true);
        setTimeout(() => {
            setClosing(false);
            closeUserInfo();
        }, 300);
    }

    let displayOutput = null;
    if (show) {
        if (userId) {
            displayOutput = (
                <>
                    <Backdrop show closeBackdrop={closeUserInfoHandler} />
                    <div className={"UserInfo " + (!closing ? "UserInfo_Show" : "UserInfo_Close")}>
                        <div className="UserInfo_Header">
                            <IconButton onClick = {closeUserInfoHandler}>
                                <KeyboardBackspaceIcon style={{color:"#fff"}}/>
                            </IconButton>
                            <h3>User Info</h3>
                        </div>
                        
                        <div className="UserInfo_Body">
                            <Avatar src={userImg} />
                            <h1>{userName}</h1>
                            <div>
                                <p><span>UserID: </span>{userId}</p>
                                <p><span>Email: </span>{userEmail}</p>
                            </div>
                            
                        </div>
                    </div>
                </>
            );
        }
    } 

    return displayOutput;
}

export default UserInfo;