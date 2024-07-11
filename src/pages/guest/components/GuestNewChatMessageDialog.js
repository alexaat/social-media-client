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
  import { useEffect, useState } from "react";
  import GuestRecipientContact from "./GuestRecipientContact";
  import GuestChatMessageInputComponent from "./GuestChatMessageInputComponent";
  import GuestChatMessagesOutlet from "./GuestChatMessagesOutlet";
  import GuestNewChatRoom from "./GuestNewChatRoom";

  import GuestContactsOutlet from "./GuestContactsOutlet";
  import { ProvideGuestData } from "./GuestDataContext";
  import GuestChatGroupsOutlet from "./GuestChatGroupsOutlet";
  
  const GuestNewChatMessageDialog = ({
    newChatMessage,
    open,
    onClose,
    newPrivateChatMessage, newChatGroupChatMessage
  }) => {
    const [
      user,
      notifications, setNotifications,
      posts, setPosts,
      users, setUser,
      followers, setFollowers,
      chatMessages, setChatMessages,
      chatRooms, setChatRooms] = ProvideGuestData();


    const [tab, setTab] = useState(0);
    const [contacts, setContacts] = useState();
    const [chatMate, setChatMate] = useState();
    const [isOpen, setIsOpen] = useState(false);
  
    const chatGroupClickHandler = (id, title) => {
        setChatMate({ id, name: title, type: "group" });
    };
  
    const [newChatRoomError, setNewChatRoomError] = useState();
    
  
    useEffect(() => {
      setNewChatRoomError(null);
  
      if (open === true) {
        setIsOpen(true);
      }
      if (open === false) {
        setIsOpen(false);
      }    
    
    // Make a list of contacts
    setContacts(prev => {
        const _contacts = new Map();
        followers.map(item => {
            if(item.followerId === user.id){
                _contacts.set(item.followeeId, {id: item.followeeId, name: users.find(u => u.id ===  item.followeeId).display_name});
            } else if (item.followeeId === user.id) {
                _contacts.set(item.followerId, {id: item.followerId, name: users.find(u => u.id ===  item.followerId).display_name});
            }

        });
        return Array.from(_contacts.values());
    }); 
   
    }, [open, followers]);
  
    const closeHandler = () => {
      onClose();
      setChatMate(null);
    };
  
    const sendHandler = (content) => {
        if(content.trim() !== ""){
            setChatMessages(prev => {
                const id = prev.length === 0 ? 1 : prev.sort((a,b) => a.id < b.id ? 1: -1)[0].id + 1;
                
                const recipient = chatMate.type === 'group'
                      ?
                      chatRooms.find(r => r.id === chatMate.id)
                      :
                      users.find(u => u.id === chatMate.id)

                const message = {
                    id,
                    sender: user,
                    recipient,
                    content,
                    date: Date.now()};

                if(recipient.title){
                  message['read_by'] = '[1]';
                  message['chat_group'] = recipient.id;
                } else {
                  message['is_read'] = true;
                }

                return [...prev, message];
            });
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
              <GuestRecipientContact chatMate={chatMate} setChatMate={setChatMate} />
                <GuestChatMessagesOutlet
                  newChatMessage={newChatMessage}
                  chatMate={chatMate}
                />         
              <GuestChatMessageInputComponent sendHandler={sendHandler} />
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
                <GuestContactsOutlet
                  newPrivateChatMessage={newPrivateChatMessage}
                  contacts={contacts}
                  contactClickHandler={contactClickHandler}               
                 />
                }
  
              {tab === 1 && (
                <>
                  <GuestNewChatRoom />
                  <GuestChatGroupsOutlet
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
  export default GuestNewChatMessageDialog;
  