import { createSlice } from "@reduxjs/toolkit";
import db from "../../firebase";
// import firebase from 'firebase';
import { ref, set, serverTimestamp } from "firebase/database";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userName: null,
    userId: null,
    userImg: null,
    token: null,
  },
  reducers: {
    SET_USER: (state, action) => {
      console.log(action);
      localStorage.setItem(
        "connectify_userData",
        JSON.stringify(action.payload)
      );
      state.userName = action.payload.userName;
      state.userId = action.payload.userId;
      state.userImg = action.payload.userImg;
      state.token = action.payload.token;
      state.userEmail = action.payload.userEmail;
      set(ref(db, "users/" + action.payload.userId), {
        userName: action.payload.userName,
        userId: action.payload.userId,
        userImg: action.payload.userImg,
        userEmail: action.payload.userEmail,
        contactList: [],
        lastSeen: serverTimestamp(),
      });
    },
    // Get user data from local storage
    GET_USER: (state) => {
      let userData = localStorage.getItem("connectify_userData");
      if (!userData) return;
      else userData = JSON.parse(userData);
      state.userName = userData.userName;
      state.userId = userData.userId;
      state.userImg = userData.userImg;
      state.token = userData.token;
      state.userEmail = userData.userEmail;
    },
    LOGOUT: (state) => {
      state = null;
      localStorage.removeItem("connectify_userData");
      window.location.reload(true);
      window.location.pathname = "/";
    },
  },
});

export const { SET_USER, GET_USER, LOGOUT } = authSlice.actions;

export const selectUserData = (state) => state.auth;

export default authSlice.reducer;
