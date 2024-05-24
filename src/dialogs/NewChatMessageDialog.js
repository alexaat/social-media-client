import {
  Dialog,
  DialogTitle,
  Typography,
  Stack,
  IconButton,
  DialogContent,
  Tab,
  Tabs,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { ProvideFollowers } from "../context/FollowersContext";
import { ProvideFollowings } from "../context/FollowingsContext";
import { useEffect, useState } from "react";
import RecipientContact from "../components/RecipientContact";
import ChatMessageInputComponent from "../components/ChatMessageInputComponent";
import ChatMessagesOutlet from "../components/ChatMessagesOutlet";
import ChatMessagesProvider, {
  ProvideChatMessages,
} from "../context/ChatMessagesContext";
import {
  INVALID_CHAT_ROOM,
  INVALID_ROOM_CHAT_TITLE_FORMAT,
  NO_USER_FOUND,
  serverHost,
  AUTHORIZATION
} from "../constants";
import { getCookie, SESSION_ID } from "../cookies";
import { handleError } from "../errors";
import NewChatRoom from "../components/NewChatRoom";
import { useNavigate } from "react-router-dom";
import ContactsOutlet from "../components/ContactsOutlet";
import ChatGroupsOutlet from "../components/ChatGroupsOutlet";

const NewChatMessageDialog = ({
  newChatMessage,
  open,
  onClose,
  reloadChatMessagesInToolBar,
  newPrivateChatMessage, newChatGroupChatMessage
}) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [followers, reloadFollowers, followersError] = ProvideFollowers();
  const [followings, reloadFollowings, followingsError] = ProvideFollowings();
  const [contacts, setContacts] = useState();
  const [chatMate, setChatMate] = useState();
  const [chatMessages, reloadChatMessages, error] = ProvideChatMessages();
  const [isOpen, setIsOpen] = useState(false);

  const [chatRooms, setChatRooms] = useState(null);
  const [reloadChatRooms, setReloadChatRooms] = useState(1);

  const chatGroupClickHandler = (id, title) => {
      setChatMate({ id, name: title, type: "group" });
      reloadChatMessages();
  };

  const [newChatRoomError, setNewChatRoomError] = useState();

  const saveChatGroup = (title, image) => {
    setNewChatRoomError(null);

    const session_id = getCookie(SESSION_ID);
    if (!session_id) {
      navigate("/signin");
      return;
    }
    const url =
      serverHost + "/chatgroups?" + new URLSearchParams({ session_id });
    let headers = new Headers();
    headers.append("Accept", "application/json");
    const formData = new FormData();
    if (image) {
      console.log('image ', image)
      formData.append("image", image);
    }
    formData.append("title", title);

    fetch(url, {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          if (
            data.error.type === INVALID_ROOM_CHAT_TITLE_FORMAT ||
            data.error.type === INVALID_CHAT_ROOM
          ) {
            setNewChatRoomError(data.error.message);
            return;
          }
          throw new Error(data.error);
        }
        if (data.payload) {
          setReloadChatRooms(Math.random());
        }
      })
      .catch((err) => handleError(err));
  };

  useEffect(() => {
    if(followersError) {
      if(followersError.type === NO_USER_FOUND) {
          navigate('/signin');            
      } else if(followersError.type !== AUTHORIZATION) {
          console.log('followersError ',followersError);
      } else {
          handleError(followersError);
      }
    }
    if(followingsError) {
      if(followingsError.type === NO_USER_FOUND) {
        navigate('/signin');
      } else if(followingsError.type !== AUTHORIZATION) {
        console.log('followingsError ',followingsError)
      } else {
        handleError(followingsError);
      }
    }

    if (open === true) {
      setIsOpen(true);
    }
    if (open === false) {
      setIsOpen(false);
    }
    if (open && typeof open === "object" && !Array.isArray(open)) {
      if (open.id && open.name) {
        setChatMate(open);
        setIsOpen(true);
      }
    }
    if (followers) {
      const contactsFromFollowers = [];
      followers.map((follower) => {
        if (follower.approved) {
          contactsFromFollowers.push({
            id: follower.follower.id,
            name: follower.follower.nick_name
              ? follower.follower.nick_name
              : follower.follower.first_name +
                " " +
                follower.follower.last_name,
          });
        }
      });

      setContacts((prev) => {
        const updatedList = prev ? [...prev] : [];
        for (let i = 0; i < contactsFromFollowers.length; i++) {
          let contains = false;
          if (prev) {
            for (let j = 0; j < prev.length; j++) {
              if (contactsFromFollowers[i].id === prev[j].id) {
                contains = true;
                break;
              }
            }
          }
          if (!contains) {
            updatedList.push(contactsFromFollowers[i]);
          }
        }
        return updatedList;
      });
    }
    if (followings) {
      const contactsFromFollowings = [];

      followings.map((following) => {
        if (following.approved) {
          contactsFromFollowings.push({
            id: following.following.id,
            name: following.following.nick_name
              ? following.following.nick_name
              : following.following.first_name +
                " " +
                following.following.last_name,
          });
        }
      });
      setContacts((prev) => {
        const updatedList = prev ? [...prev] : [];
        for (let i = 0; i < contactsFromFollowings.length; i++) {
          let contains = false;
          if (prev) {
            for (let j = 0; j < prev.length; j++) {
              if (contactsFromFollowings[i].id === prev[j].id) {
                contains = true;
                break;
              }
            }
          }
          if (!contains) {
            updatedList.push(contactsFromFollowings[i]);
          }
        }
        return updatedList;
      });
    }

    //Get Chat Groups
    const session_id = getCookie(SESSION_ID);
    if (!session_id) {
      navigate("/signin");
      return;
    }
    let url = `${serverHost}/chatgroups?` + new URLSearchParams({ session_id });
    fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((resp) => resp.json())
      .then((data) => {    
        if (data.error) {
          if(data.error.type === NO_USER_FOUND){
            navigate('/signin')
          } else {
            throw new Error(data.error);
          }
         
        }
        if (data.payload) {
          setChatRooms(data.payload);
        }
      })
      .catch((err) => {
        handleError(err);
      });
  }, [open, followers, followings, reloadChatRooms, followersError, followingsError]);

  const closeHandler = () => {
    onClose();
    setChatMate(null);
  };

  const sendHandler = (message) => {
    if (message.trim() !== "") {
      const session_id = getCookie(SESSION_ID);
      if (!session_id) {
        navigate("/signin");
        return;
      }

      const url =
        serverHost + "/chatmessages?" + new URLSearchParams({ session_id });
      const params = new URLSearchParams({ message });
      if (chatMate.type === "user") {
        params.append("recipient_id", chatMate.id);
      } else if (chatMate.type === "group") {
        params.append("chat_group_id", chatMate.id);
      }

      let headers = new Headers();
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      fetch(url, {
        method: "POST",
        headers: headers,
        body: params,
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          if (data.payload) {
            reloadChatMessages();
            reloadChatMessagesInToolBar();
          }
        })
        .catch((err) => handleError(err));
    }
  };

  const contactClickHandler = contact => setChatMate(contact); 

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: {
          minWidth: "400px",
          minHeight: "380px",
          p: 0,
          m: 0,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6">New Chat Message</Typography>
          <IconButton
            sx={{ p: 0, m: 0 }}
            aria-label="close new chat dialog button"
            onClick={closeHandler}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {chatMate ? (
          <>
            <RecipientContact chatMate={chatMate} setChatMate={setChatMate} />
            <ChatMessagesProvider chat_mate={chatMate}>
              <ChatMessagesOutlet
                newChatMessage={newChatMessage}
                reload={chatMessages}
                chatMate={chatMate}
                reloadChatMessagesInToolBar={reloadChatMessagesInToolBar}
              />
            </ChatMessagesProvider>
            <ChatMessageInputComponent sendHandler={sendHandler} />
          </>
        ) : (
          <>
            <Tabs
              aria-label="chat messages tabs"
              value={tab}
              onChange={(event, newValue) => setTab(newValue)}
            >
              <Tab label="Users" />
              <Tab label="Chat Rooms" />
            </Tabs>

            {tab === 0 &&
              contacts &&
              <ContactsOutlet
                newPrivateChatMessage={newPrivateChatMessage}
                contacts={contacts}
                contactClickHandler={contactClickHandler}               
               />
              }

            {tab === 1 && (
              <>
                <NewChatRoom save={saveChatGroup} error={newChatRoomError} />
                <ChatGroupsOutlet
                  newChatGroupChatMessage={newChatGroupChatMessage}
                  chatGroups={chatRooms}
                  chatGroupClickHandler={chatGroupClickHandler}

                />
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default NewChatMessageDialog;
