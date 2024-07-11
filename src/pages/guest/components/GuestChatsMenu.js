import { Typography, IconButton, Menu, Stack,  Divider } from "@mui/material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import GuestChatItemsOutlet from "./GuestChatItemsOutlet";
import { ProvideGuestData } from "./GuestDataContext";
import { useEffect, useState } from "react";

const GuestChatsMenu = ({ancor, onClose, newChatMessageClickHandler, chatSelectedHandler}) => {

    const [
      user,
      notifications, setNotifications,
      posts, setPosts,
      users, setUser,
      followers, setFollowers,
      chatMessages, setChatMessages,
      chatRooms, setChatRooms] = ProvideGuestData();

      //Create chats

      const [chats, setChats] = useState([]);
      
      useEffect(() => {
      
        let index = 1;
        const chats = [];
  
        chatMessages.forEach(item => {         
            //chat_group  
          if((item.recipient.display_name && item.recipient.id === user.id) || item.recipient.title){
              const chat = {
                id: index,
                chat_group: item.recipient.title ? item.recipient : undefined,
                sender: item.sender,
                content: item.content,
                date: item.date
              } 
    
              //check for dublicates
              let contains = false;
              for(let i = 0; i < chats.length; i++){
                const _chat = chats[i];
                //Check chat rooms
                if(_chat.chat_group && chat.chat_group){
                  if(_chat.chat_group.id === chat.chat_group.id){
                    if(chat.date>_chat.date){
                      chats[i] = chat;
                    }
                    contains = true;
                    break;
                  }
                }
    
                if(!_chat.chat_group && !item.chat_group){
                  if(_chat.sender.id === chat.sender.id){
                    if(chat.date>_chat.date){
                      chats[i] = chat;
                    }               
                    contains = true;
                    break;
                  }
                } 
              }
    
              if(!contains){
                chats.push(chat);
                index++;
              }
          }
        });
  
        chats.sort((a,b) => a.date < b.date ? 1 : -1);

        setChats(chats);
        
      },[chatMessages]);          

    
    return ( 
        <Menu
        slotProps={{
          paper: {
            sx: {
              width: "350px",
            },
          },
        }}
        open={Boolean(ancor)}
        anchorEl={ancor}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Stack
          spacing={2}
          sx={{ ml: 2, mr: 2 }}
          direction="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Chats</Typography>
          <IconButton
            disableFocusRipple
            disableRipple
            sx={{ p: 0, m: 0 }}
            aria-label="new chat message button"
            onClick={newChatMessageClickHandler}
          >
            <EditNoteRoundedIcon />
          </IconButton>
        </Stack>

        <Divider />
        {!chatMessages || chatMessages.length === 0 ? (
          <Stack sx={{ px: 2 }}>
            <Typography variant="body1" sx={{ py: 1 }}>
              No Chats
            </Typography>
          </Stack>
        ) : (
          <GuestChatItemsOutlet
            chats={chats}
            chatSelectedHandler={chatSelectedHandler}
          />
        )}
      </Menu>
    );
}
 
export default GuestChatsMenu;