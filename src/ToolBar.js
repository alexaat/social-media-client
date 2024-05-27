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
import { useNavigate } from "react-router-dom";
import { getCookie, SESSION_ID, deleteCookie } from "./cookies";
import { useEffect, useState } from "react";
import {
  serverHost,
  NOTIFICATION_FOLLOW_INFO,
  NOTIFICATION_FOLLOW_ACTION_REQUEST,
  NEW_NOTIFICATION,
  FOLLOW_REQUEST_NOT_FOUND,
  NEW_CHAT_MESSAGE,
  INVALID_GROUP_TITLE,
  INVALID_GROUP_DESCRIPTION,
  INVITATION_TO_JOIN_GROUP,
} from "./constants.js";
import Icon from "./components/Icon";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { ProvideNotifications } from "./context/NotificationsContext";
import { ProvideFollowings } from "./context/FollowingsContext";
import { handleError } from "./errors";
import ApproveFollowerDialog from "./dialogs/ApproveFollowerDialog";
import InfoDialog from "./dialogs/InfoDialog";
import { ProvideFollowers } from "./context/FollowersContext.js";
import MessageRoundedIcon from "@mui/icons-material/MessageRounded";
import NewChatMessageDialog from "./dialogs/NewChatMessageDialog";
import { ProvideChatMessages } from "./context/ChatMessagesContext.js";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import GroupsMenu from "./menu/GroupsMenu";
import { ProvideGroups } from "./context/GroupsContext.js";
import NewGroupDialog from "./dialogs/NewGroupDialog";
import { ProvideWebSocket } from "./context/WebSocketContext.js";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { ProvideUser } from "./context/UserContext";
import {
  calculateNonReadChatGroupMessages,
  calculateNonReadPrivateMessages,
} from "./util.js";
import ProfileMenu from "./menu/ProfileMenu.js";
import NotificationsMenu from "./menu/NotificationsMenu.js";
import ChatsMenu from "./menu/ChatsMenu.js";

const ToolBar = () => {
  //Navigation
  const navigate = useNavigate();

  //User
  const [user] = ProvideUser();

  const [clickedNotification, setClickedNotification] = useState(null);

  const [chatMessages, reloadChatMessages, error] = ProvideChatMessages();

  const [followers, reloadFollowers] = ProvideFollowers();
  const [followings, reloadFollowings] = ProvideFollowings();

  const [notifications, reloadNotifications] = ProvideNotifications();

  const [socket, wsError] = ProvideWebSocket();

  const [newChatMessage, setNewChatMessage] = useState();

  //Refresh chat messages in components
  const [newPrivateChatMessage, setNewPrivateChatMessage] = useState();
  const [newChatGroupChatMessage, setNewChatGroupChatMessage] = useState();

  if (socket) {
    socket.onmessage = (message) => onMessageReceived(message);
    socket.onerror = (error) => onMessageError(error);
    socket.onclose = () => navigate("/signin");
  }
  if (wsError) {
    //console.log('wsError: ', wsError)
  }

  //WS
  const onMessageReceived = (message) => {
    const m = JSON.parse(message.data);
    switch (m.type) {
      case NEW_NOTIFICATION:
        reloadNotifications();
        if (m.payload) {
          if (
            m.payload.type === NOTIFICATION_FOLLOW_INFO ||
            m.payload.type === NOTIFICATION_FOLLOW_ACTION_REQUEST
          ) {
            if (reloadFollowings) {
              reloadFollowings();
            }
            if (reloadFollowers) {
              reloadFollowers();
            }
          }
        }
        break;
      case NEW_CHAT_MESSAGE:
        if (reloadChatMessages) {
            reloadChatMessages();
        }
        if(m.chat_group) {
          setNewChatGroupChatMessage(m);
        } else {
          setNewPrivateChatMessage(m);
        }

        setNewChatMessage(m);
        break;

      case INVITATION_TO_JOIN_GROUP:
        reloadNotifications();
        break;
    }
  };

  const onMessageError = (error) => {
    //console.log(`socket error: ${error}`)
  };

  //SnackBar
  const [snackBarMessage, setSnackBarMessage] = useState(null);

  //Profile Icon/Menu
  const [profileAncorEl, setProfileAncorEl] = useState(null);
  const profileCloseHandler = () => setProfileAncorEl(null);
  const profileClickHandler = (e) => setProfileAncorEl(e.currentTarget);

  //Notifications
  const [notificationsAncorEl, setNotificationsAncorEl] = useState(null);
  const notificationsOpen = Boolean(notificationsAncorEl);
  const newNotifications = notifications
    ? notifications.filter((item) => !item.is_read).length
    : 0;
  const notificationsCloseHandler = () => setNotificationsAncorEl(null);
  const notificationsClickHandler = (e) => setNotificationsAncorEl(e.currentTarget);

  //Follower Approval Dialog
  const approveFollowerDialogCloseHandler = () => {
    setClickedNotification(null);
  };
  const approveFollowerHandler = (approved) => {
    const session_id = getCookie(SESSION_ID);
    if (session_id) {
      fetch(serverHost + "/followers?" + new URLSearchParams({ session_id }), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          // follower_id: follower.id,
          follower_id: clickedNotification.sender.id,
          approved,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            if (data.error.type == FOLLOW_REQUEST_NOT_FOUND) {
              setSnackBarMessage(data.error.message);
            } else {
              throw new Error(data.error);
            }
          }
        })
        .catch((err) => handleError(err));

      approveFollowerDialogCloseHandler();
    } else {
      approveFollowerDialogCloseHandler();
      navigate("/signin");
    }
  };

  //Info Dialog
  const infoDialogCloseHandler = () => {
    setClickedNotification(null);
  };

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

  const [unreadPrivateMessages, setUnreadPrivateMessages] = useState(0);
  const [unreadChatGroupMessages, setUnreadChatGroupMessages] = useState(0);

  useEffect(() => {
    if (user && chatMessages) {
      setUnreadPrivateMessages(
        calculateNonReadPrivateMessages(chatMessages, user.id)
      );
      setUnreadChatGroupMessages(
        calculateNonReadChatGroupMessages(chatMessages, user.id)
      );
    }   
  }, [chatMessages, unreadPrivateMessages, unreadChatGroupMessages]);

  //Groups
  const [groupsAncorEl, setGroupsAncorEl] = useState(null);
  const groupsClickHandler = (e) => setGroupsAncorEl(e.currentTarget);
  const groupsCloseHandler = () => setGroupsAncorEl(null);
  const [groups, reloadGroups] = ProvideGroups();
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
    const session_id = getCookie(SESSION_ID);
    if (!session_id) {
      navigate("signin");
      return;
    }
    const url = serverHost + "/groups?" + new URLSearchParams({ session_id });

    setNewGroupTitleError();
    setNewGroupDescriptionError();

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ title, description }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log("DATA ", data);
        if (data.error) {
          if (data.error.type === INVALID_GROUP_TITLE) {
            setNewGroupTitleError(data.error.message);
          } else if (data.error.type === INVALID_GROUP_DESCRIPTION) {
            setNewGroupDescriptionError(data.error.message);
          } else if (data.error.message.includes("UNIQUE constraint failed")) {
            setNewGroupTitleError("Group with title already exists");
          } else {
            throw new Error(data.error);
          }
        }
        if (data.payload) {
          setNewGroupTitleError();
          setNewGroupDescriptionError();
          newGroupDialogCloseHandler();
          reloadGroups();
          navigate(`groups/${data.payload.group_id}`);
        }
      })
      .catch((err) => handleError(err));
  };

  return (
    <>
      {user && (
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ width: "100%" }}>
              Social Media
            </Typography>
            <IconButton
              aria-label="go home button"
              sx={{ background: "#eeeeee", mr: 2 }}
              onClick={() => navigate("/")}
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
              <Icon user={user} />
            </IconButton>
            
          </Toolbar>
        </AppBar>
      )}

      {/* Profile Menu */}
      <ProfileMenu ancor={profileAncorEl} onClose={profileCloseHandler}/>

      {/* Notifications Menu */}
      <NotificationsMenu ancor={notificationsAncorEl} onClose={notificationsCloseHandler} setClickedNotification={setClickedNotification}/>

      {/* Chats Menu */}
      <ChatsMenu ancor={chatsAncorEl} onClose={chatsCloseHandler} newChatMessageClickHandler={newChatMessageClickHandler} chatSelectedHandler={chatSelectedHandler}/>

      {clickedNotification &&
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
        )}

      {clickedNotification &&
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
        )}

      <Snackbar
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
      </Snackbar>

      <NewChatMessageDialog
        newPrivateChatMessage={newPrivateChatMessage}
        newChatGroupChatMessage={newChatGroupChatMessage}
        newChatMessage={newChatMessage}
        open={newChatDialogOpen}
        onClose={() => setNewChatDialogOpen(false)}
        reloadChatMessagesInToolBar={reloadChatMessages}
      />

      <NewGroupDialog
        open={newGroupDialogOpen}
        onClose={newGroupDialogCloseHandler}
        onSubmit={createNewGroupHandler}
        newGroupTitleError={newGroupTitleError}
        newGroupDescriptionError={newGroupDescriptionError}
      />

      <GroupsMenu
        groupsAncorEl={groupsAncorEl}
        groupsCloseHandler={groupsCloseHandler}
        createGroupHandler={createGroupHandler}
        groups={groups}
        menuItemClickHandler={menuItemClickHandler}
      />
    </>
  );
};
export default ToolBar;
