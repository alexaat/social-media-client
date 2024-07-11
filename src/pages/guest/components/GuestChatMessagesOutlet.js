import { Stack } from "@mui/material";
import GuestChatMessage from "./GuestChatMessage";
import { useEffect, useState } from "react";
import { ProvideGuestData } from "./GuestDataContext";

const GuestChatMessagesOutlet = ({chatMate}) => {

const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers, chatMessages, setChatMessages] = ProvideGuestData();

const [filtered, setFiltered] = useState();

useEffect(() => {

  if (chatMate && chatMate.type === "user") {
        setFiltered(prev => {

          const fl = chatMessages.filter(item => {
            if(item.recipient.title){
              return false;
            }            
            if(item.sender.id === user.id && item.recipient.id === chatMate.id){
                return true;
            }
            if(item.recipient.id === user.id && item.sender.id === chatMate.id){
                return true
            }
            return false;
          });
          return fl;
        })

  }

  if (chatMate && chatMate.type === "group") {
    setFiltered(prev => {
       const fl = chatMessages.filter(item => item.recipient.title && item.recipient.id === chatMate.id);
       return fl;
    });
  }
  
  setRead();


},[chatMessages]);

const sorted = filtered ? filtered.sort((a,b) => a.id < b.id ? 1 : -1) : undefined;

const setRead = () => {
  if(chatMate.type === 'group'){
    
    const updated = [];
    let needUpdate = false;
    for(let i = 0; i < chatMessages.length; i++){
      const chatMessage = chatMessages[i];
      if(chatMessage.read_by){
        const arr = JSON.parse(chatMessage.read_by);
        if(!arr.includes(user.id)){
          arr.push(user.id);
          needUpdate = true;
          chatMessage.read_by = JSON.stringify(arr);
        }
      }
      updated.push(chatMessage);
    }
    if(needUpdate){    
      setChatMessages(updated);
    }
  } else {
    const updated = [];
    let needUpdate = false;
    for(let i = 0; i < chatMessages.length; i++){
      const chatMessage = chatMessages[i];
      if(chatMessage.is_read === false){
        chatMessage.is_read = true;
        needUpdate = true;
      }
      updated.push(chatMessage);
    }
    if(needUpdate){    
      setChatMessages(updated);
    }
  } 
}

  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid #eeeeeeee",
        borderRadius: "4px",
        flex: "grow",
        height: "300px",
        p: 1,
        mt: 2,
        overflowY: "auto",
      }}
    >
      {sorted &&
        sorted.map((message) => (
          <GuestChatMessage
            key={message.id}
            sender_id={message.sender.id}
            title={message.sender.display_name}
            text={message.content}
            date={message.date}
          />
        ))}
    </Stack>
  );
};

export default GuestChatMessagesOutlet;
