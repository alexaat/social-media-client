import { Stack } from "@mui/material";
import ChatRoomItem from "./ChatRoomItem";
import { useEffect } from "react";
import { ProvideChatMessages } from "../context/ChatMessagesContext";
import { ProvideUser } from "../context/UserContext";

const ChatGroupsOutlet = ({chatGroups, chatGroupClickHandler, newChatGroupChatMessage}) => {
    
    const [chatMessages, reloadChatMessages] = ProvideChatMessages();
    const [user] = ProvideUser();
  
    useEffect(() => {
        reloadChatMessages();
    },[newChatGroupChatMessage, user])
  
    const calculateUnread = (chatGroupId) => {
        let unread = 0;
        if(chatMessages && user) {    
            chatMessages.forEach(m => {
                if(m.chat_group){
                  if(m.read_by) {
                    const readBys = JSON.parse(m.read_by)
                    if(readBys && !readBys.includes(user.id) && chatGroupId === m.chat_group.id){
                        unread ++;
                    }             
                  }      
                }
            });
          }
        return unread;
    }     
    return ( 
        <Stack sx={{ overflow: "scroll", pt: 1 }}>
        {chatGroups &&
          chatGroups.length > 0 &&
          chatGroups.map((room) => (
            <ChatRoomItem
              unread={calculateUnread(room.id)}
              room={room}
              key={room.id}
              clickHandler={chatGroupClickHandler}
            />
          ))}
      </Stack>
     );
}
 
export default ChatGroupsOutlet;