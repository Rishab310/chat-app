import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// import firebase from 'firebase';
import db from './firebase';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
// import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import AdminChat from './components/AdminChat/AdminChat';
import { selectUserData, GET_USER } from './redux/reducers/authSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ref, update, serverTimestamp } from "firebase/database";
function App() {
  const [loading, setLoading] = useState(true);
  const userData = useSelector(selectUserData);
  const [isInterval, setIsInterval] = useState(false);
  const [updateLastSeen, setUpdateLastSeen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GET_USER());
    setLoading(false); 
  }, [dispatch]);

  useEffect(() => {
    if (userData && userData.userId && !isInterval) {
      setInterval(() => {
        if (userData && userData.userId) {
          update(ref(db, 'users/' + userData.userId), {
            lastSeen: serverTimestamp()
        });
        }
        setIsInterval(true);
        setUpdateLastSeen(prevState => !prevState);
      }, 1000 * 60); // Update last seen every 1 minute
    }
  }, [userData]);

  return (
    <div className="App">
      { loading ? (
          <CircularProgress />
        ) : userData.token ? (
          <div className="App_Body">
            <Sidebar update={updateLastSeen} />
            <Switch>
              {/* <Route path="/user/:userId" exact component={Chat} /> */}
              {/* <Route path="/room/:roomId" exact component={Chat} /> */}
              <Route path="/" exact component={AdminChat} />
            </Switch>
          </div>
        ) : (
          <Login />
        ) 
      }
    </div>
  );
}

export default App;
