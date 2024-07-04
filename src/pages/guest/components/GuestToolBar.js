import { useEffect, useState, useRef } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Badge,
    Stack,
    Divider,
    Snackbar,
    Alert,
  } from "@mui/material";
  import { useNavigate } from 'react-router-dom';
  import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
  import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
  import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
  import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
  import {ProvideGuestData} from '../components/GuestDataContext';
  import GuestIcon from './GuestIcon';
  import GuestProfileMenu from '../components/GuestProfileMenu';
  import GuestNotificationsMenu from './GuestNotificationsMenu';

const GuestToolBar = () => {

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();
    const isFollowingRef = useRef(false);

    //const [userStr, setUserStr] = useState(JSON.stringify(user));

    //let userStr = JSON.stringify(user);
    //let userStr = '{"id":1,"first_name":"Guest","last_name":"Special","display_name":"Guest","avatar":"http://alexaat.com/socialmedia/images/Guest.jpg",//"privacy":"private","email":"guest@special.com","about_me":"Thank you for using social media"}'

    const createFollowRequest = () => {
     
        // const _user = JSON.parse(userStr);
        console.log('user in function', user)
   
        //1. Add Notification
        setNotifications(prev => {
          const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
          const sender = users.find(u=> u.id === 2);
          const content = 
            user.privacy === 'private'
              ?
              'You have a follower request from ' + sender.display_name
              :
              'You have a new follower: ' + sender.display_name;

          const notification = {
              id,
              content,
              date:  Date.now(),
              sender,
              is_read: false
          }
              return [...prev, notification];
        })

        //2. Add follower
        const status = user.privacy === 'private' ? 'pending' : 'approved'; 
        const follower = {
          followerId: 2,
          followeeId: 1,
          date: Date.now(),
          status
        } 

        setFollowers(prev => {
           const filtered = prev.filter(f => !(f.followeeId === 1 && f.followerId === 2));
           return [...filtered, follower];
        })       
    }


    
    useEffect(() => { 

     console.log('USER ', user) 
    // setUserStr(JSON.stringify(user));
     // userStr = JSON.stringify(user)

      const isFollowing = followers.find(f => f.followeeId === 1 && f.followerId === 2)
      if(!isFollowing && !isFollowingRef.current){
        isFollowingRef.current = true;
        setTimeout(createFollowRequest, 10000);
        console.log('set timeout')
      }


      // var a = 10;
      // function foo(){
      //   console.log(a)
      // }
      // setTimeout(foo, 2000);
      // a=20;
      
    },[user]);    

    const navigate = useNavigate();


    //Profile Menu
    const [profileAncorEl, setProfileAncorEl] = useState(null);
    const profileCloseHandler = () => setProfileAncorEl(null);
    const profileClickHandler = (e) => setProfileAncorEl(e.currentTarget);

    //Notifications
    const [clickedNotification, setClickedNotification] = useState(null);
    const [notificationsAncorEl, setNotificationsAncorEl] = useState(null);
    const notificationsOpen = Boolean(notificationsAncorEl);
    const newNotifications = notifications
      ? notifications.filter((item) => !item.is_read).length
      : 0;
    const notificationsCloseHandler = () => setNotificationsAncorEl(null);
    const notificationsClickHandler = (e) => setNotificationsAncorEl(e.currentTarget);

    return (
        <>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ width: "100%" }}>
                Social Media
              </Typography> 
              <IconButton
                aria-label="go home button"
                sx={{ background: "#eeeeee", mr: 2 }}
                onClick={() => navigate("/guest")}
              >
                <HomeRoundedIcon />
              </IconButton>
  
              <IconButton
                aria-label="notifications"
                sx={{ background: "#eeeeee", mr: 2 }}
               // onClick={groupsClickHandler}
              >
                <GroupsRoundedIcon />
              </IconButton>
  
              <Badge
              //  badgeContent={unreadPrivateMessages + unreadChatGroupMessages}
                color="secondary"
                sx={{ mr: 2 }}
              >
                <IconButton
                  sx={{ background: "#eeeeee" }}
                  aria-label="chat-message"
                 // onClick={chatsClickHandler}
                >
                  <MessageRoundedIcon />
                </IconButton>
              </Badge>
  
              <Badge
                badgeContent={newNotifications}
                color="secondary"
                sx={{ mr: 2 }}
              >
                <IconButton
                  sx={{ background: "#eeeeee" }}
                  aria-label="notifications"
                  onClick={notificationsClickHandler}
                //   aria-controls={
                //     notificationsOpen ? "notifications-menu" : undefined
                //   }
                  aria-haspopup="true"
                 // aria-expanded={notificationsOpen ? "true" : undefined}
                >
                  <NotificationsRoundedIcon />
                </IconButton>
              </Badge>
  
              <IconButton
                aria-label="user icon"
                sx={{ width: "48px", height: "48px", background: "#eeeeee" }}
                onClick={profileClickHandler}
              >
                <GuestIcon user={user} />
              </IconButton>
              
            </Toolbar>
          </AppBar>

  
        {/* Profile Menu */}
        <GuestProfileMenu ancor={profileAncorEl} onClose={profileCloseHandler}/>
  
        {/* Notifications Menu */}
        <GuestNotificationsMenu ancor={notificationsAncorEl} onClose={notificationsCloseHandler} setClickedNotification={setClickedNotification}/>
  
        {/* Chats Menu */}
        {/* <ChatsMenu ancor={chatsAncorEl} onClose={chatsCloseHandler} newChatMessageClickHandler={newChatMessageClickHandler} chatSelectedHandler={chatSelectedHandler}/> */}
  


        {/*clickedNotification &&
          clickedNotification.type === NOTIFICATION_FOLLOW_ACTION_REQUEST && (
            <ApproveFollowerDialog
              approveFollowerDialogOpen={
                clickedNotification &&
                clickedNotification.type === NOTIFICATION_FOLLOW_ACTION_REQUEST
              }
              approveFollowerDialogCloseHandler={
                approveFollowerDialogCloseHandler
              }
              approveFollowerHandler={approveFollowerHandler}
              user={clickedNotification.sender}
            />
            )*/}
  
        {/* {clickedNotification &&
          clickedNotification.type === NOTIFICATION_FOLLOW_INFO && (
            <InfoDialog
              dialogOpen={
                clickedNotification &&
                clickedNotification.type === NOTIFICATION_FOLLOW_INFO
              }
              dialogCloseHandler={infoDialogCloseHandler}
              user={clickedNotification.sender}
              message={clickedNotification.content}
              title={
                clickedNotification.type.substring(0, 1).toUpperCase() +
                clickedNotification.type.substring(1)
              }
            />
          )} */}
  
        {/* <Snackbar
          open={
            snackBarMessage !== null &&
            snackBarMessage !== undefined &&
            snackBarMessage !== ""
          }
          autoHideDuration={3000}
          onClose={() => setSnackBarMessage(null)}
          message={snackBarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackBarMessage(null)}
            severity="error"
            sx={{ width: "100%" }}
          >
            {snackBarMessage}
          </Alert>
        </Snackbar> */}
  
        {/* <NewChatMessageDialog
          newPrivateChatMessage={newPrivateChatMessage}
          newChatGroupChatMessage={newChatGroupChatMessage}
          newChatMessage={newChatMessage}
          open={newChatDialogOpen}
          onClose={() => setNewChatDialogOpen(false)}
          reloadChatMessagesInToolBar={reloadChatMessages}
        /> */}
  
        {/* <NewGroupDialog
          open={newGroupDialogOpen}
          onClose={newGroupDialogCloseHandler}
          onSubmit={createNewGroupHandler}
          newGroupTitleError={newGroupTitleError}
          newGroupDescriptionError={newGroupDescriptionError}
        /> */}
  
        {/* <GroupsMenu
          groupsAncorEl={groupsAncorEl}
          groupsCloseHandler={groupsCloseHandler}
          createGroupHandler={createGroupHandler}
          groups={groups}
          menuItemClickHandler={menuItemClickHandler}
        /> */}
      </>   
      

        
        
    );
}
 
export default GuestToolBar;