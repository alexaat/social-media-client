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
  import GuestChatsMenu from './GuestChatsMenu';
  import GuestNewChatMessageDialog from "./GuestNewChatMessageDialog";
  import {calculateNonReadPrivateMessages, calculateNonReadChatGroupMessages} from '../../../util';
  import GuestGroupsMenu from './GuestGroupsMenu';
  import GuestNewGroupDialog from './GuestNewGroupDialog';


const GuestToolBar = () => {

  const [
    user,
    notifications, setNotifications,
    posts, setPosts,
    users, setUser,
    followers, setFollowers,
    chatMessages, setChatMessages,
    chatRooms, setChatRooms,
    groups, setGroups] = ProvideGuestData();

    const isFollowingRef = useRef(false);

    const userRef = useRef(user);
    const johnRef = useRef(false);

    const createFollowRequest = () => {
   
        const u = userRef.current;

        //1. Add Notification
        setNotifications(prev => {
          const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
          const sender = users.find(u=> u.id === 2);
          const content = 
            u.privacy === 'private'
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
        const status = u.privacy === 'private' ? 'pending' : 'approved'; 
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

    const sendChatMessageToGroup = () => {
       
      setChatMessages(prev => {
        const id = prev.length === 0 ? 1 : prev.sort((a,b) => (a.id < b.id ? 1 : -1))[0].id + 1;

        const chatMessage = {
          id,
          sender: {
            id: 4,
            first_name: 'George',
            last_name: 'Harrison',
            display_name: 'George',
            avatar: 'http://alexaat.com/socialmedia/images/George.jpg',
            privacy: 'public',
            email: 'george@thebeatles.uk',
            about_me: "Basically, I feel fortunate to have realized what the goal is in life. There's no point in dying having gone through your life without knowing who you are, what you are, or what the purpose of life is. And that's all it is."
          },
          recipient: {                
              id: 1,
              title: 'old friends',
              image: 'http://alexaat.com/socialmedia/images/room1.jpeg'
          },
          content: 'Hello, friends',
          date: Date.now(),
          read_by: '[4]',
          chat_group: 1
        }
        return [...prev, chatMessage]

       });
    }

    const sendChatMessageByJohn = () => {
      const alreadySent = chatMessages.find(m => m.sender.id === 2 && m.recipient.display_name && m.recipient.id === 1 && m.content === 'Greetings, Guest!!!') 
      if(alreadySent || johnRef.current){
        return;
      }

      johnRef.current = true;

      setChatMessages(prev => {
        const id = prev.length === 0 ? 1 : prev.sort((a,b) => (a.id < b.id ? 1 : -1))[0].id + 1;
        const chatMessage = {
          id,
          sender: {
            id: 2,
            first_name: 'John',
            last_name: 'Lennon',
            display_name: 'John',
            avatar: 'http://alexaat.com/socialmedia/images/John.jpg',
            privacy: 'public',
            email: 'john@thebeatles.uk',
            about_me: 'Life is what happens while you are busy making other plans.'
          },
          recipient: {                
            id: 1,
            first_name: 'Guest',
            last_name: 'Special',
            display_name: 'Guest',
            avatar: 'http://alexaat.com/socialmedia/images/Guest.jpg',
            privacy: 'public',
            email: 'guest@special.com',
            about_me: 'Thank you for using social media'
          },
          content: 'Greetings, Guest!!!',
          date: Date.now(),
          is_read: false          
        }
        return [...prev, chatMessage]

       });
    }

    useEffect(() => { 
      userRef.current = user;      
      const isFollowing = followers.find(f => f.followeeId === 1 && f.followerId === 2)
      if(!isFollowing && !isFollowingRef.current){
        isFollowingRef.current = true;        
        setTimeout(createFollowRequest, 10000);      
        setTimeout(sendChatMessageToGroup, 15000);     
      }
      setUnreadPrivateMessages(
        calculateNonReadPrivateMessages(chatMessages, user.id)
      );
      setUnreadChatGroupMessages(
        calculateNonReadChatGroupMessages(chatMessages, user.id)
      );

      const john = followers.find(item => item.followerId === 2 && item.followeeId === 1 && item.status === 'approved')

      if(john){
        const alreadySent = chatMessages.find(m => m.sender.id === 2 && m.recipient.display_name && m.recipient.id === 1 && m.content === 'Greetings, Guest!!!') 
        if(!alreadySent){
          setTimeout(sendChatMessageByJohn,5000);    
        }
         
      }
 

      
    },[user, chatMessages, followers]);    

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

    //Chats
    const [chatsAncorEl, setChatsAncorEl] = useState(null);
    const chatsCloseHandler = () => setChatsAncorEl(null);
    const chatsClickHandler = (e) => setChatsAncorEl(e.currentTarget);
    const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
    const newChatMessageClickHandler = () => {
      chatsCloseHandler();
      setNewChatDialogOpen(true);
    };
    const chatSelectedHandler = (message) => {
      chatsCloseHandler();
      setNewChatDialogOpen(true);
    };
    //Refresh chat messages in components
    const [newPrivateChatMessage, setNewPrivateChatMessage] = useState();
    const [newChatGroupChatMessage, setNewChatGroupChatMessage] = useState();
    const [newChatMessage, setNewChatMessage] = useState();
    const reloadChatMessages = () => console.log('reload...');
    const [unreadPrivateMessages, setUnreadPrivateMessages] = useState(0);
    const [unreadChatGroupMessages, setUnreadChatGroupMessages] = useState(0);
  
    //Groups
     //Groups
  const [groupsAncorEl, setGroupsAncorEl] = useState(null);
  const groupsClickHandler = (e) => setGroupsAncorEl(e.currentTarget);
  const groupsCloseHandler = () => setGroupsAncorEl(null);
  //const [groups, reloadGroups] = ProvideGroups();
  const menuItemClickHandler = (group) => {
    groupsCloseHandler();
    navigate("/groups/" + group.id.toString());
  };

  //New Group
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const newGroupDialogCloseHandler = () => {
    setNewGroupTitleError();
    setNewGroupDescriptionError();
    setNewGroupDialogOpen(false);
  };
  const createGroupHandler = () => {
    groupsCloseHandler();
    setNewGroupDialogOpen(true);
  };
  const [newGroupTitleError, setNewGroupTitleError] = useState();
  const [newGroupDescriptionError, setNewGroupDescriptionError] = useState();
  const createNewGroupHandler = (title, description) => {
    console.log('title ',title);    
    console.log('description ',description);
    
    //Check repeat
    

    setNewGroupTitleError();
    setNewGroupDescriptionError();
    newGroupDialogCloseHandler();
   
    //navigate(`groups/${data.payload.group_id}`);
  };



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
                onClick={groupsClickHandler}
              >
                <GroupsRoundedIcon />
              </IconButton>
  
              <Badge
                badgeContent={unreadPrivateMessages + unreadChatGroupMessages}
                color="secondary"
                sx={{ mr: 2 }}
              >
                <IconButton
                  sx={{ background: "#eeeeee" }}
                  aria-label="chat-message"
                  onClick={chatsClickHandler}
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
                  aria-controls={
                    notificationsOpen ? "notifications-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={notificationsOpen ? "true" : undefined}
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
        <GuestChatsMenu ancor={chatsAncorEl} onClose={chatsCloseHandler} newChatMessageClickHandler={newChatMessageClickHandler} chatSelectedHandler={chatSelectedHandler}/>
  


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
  
        <GuestNewChatMessageDialog
          newPrivateChatMessage={newPrivateChatMessage}
          newChatGroupChatMessage={newChatGroupChatMessage}
          newChatMessage={newChatMessage}
          open={newChatDialogOpen}
          onClose={() => setNewChatDialogOpen(false)}
          reloadChatMessagesInToolBar={reloadChatMessages}
        />
  
        <GuestNewGroupDialog
          open={newGroupDialogOpen}
          onClose={newGroupDialogCloseHandler}
          onSubmit={createNewGroupHandler}
          newGroupTitleError={newGroupTitleError}
          newGroupDescriptionError={newGroupDescriptionError}
        />
  
        <GuestGroupsMenu
          groupsAncorEl={groupsAncorEl}
          groupsCloseHandler={groupsCloseHandler}
          createGroupHandler={createGroupHandler}
          groups={groups}
          menuItemClickHandler={menuItemClickHandler}
        />
      </>   
      

        
        
    );
}
 
export default GuestToolBar;