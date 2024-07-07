import { Stack } from "@mui/material";
import GuestChatRoomItem from "./GuestChatRoomItem";
import { ProvideGuestData } from "./GuestDataContext";

const GuestChatGroupsOutlet = ({chatGroups, chatGroupClickHandler, newChatGroupChatMessage}) => {
    
    const [
        user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms] = ProvideGuestData();


    const calculateUnread = (chatGroupId) => {
        let unread = 0;
        if(chatMessages && user) {    
            chatMessages.forEach(m => {
                if(m.chat_group){
                  if(m.read_by) {
                    const readBys = JSON.parse(m.read_by)
                    if(readBys && !readBys.includes(user.id) && chatGroupId === m.chat_group){
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
        {chatRooms &&
          chatRooms.length > 0 &&
          chatRooms.map((room) => (
            <GuestChatRoomItem
              unread={calculateUnread(room.id)}
              room={room}
              key={room.id}
              clickHandler={chatGroupClickHandler}
            />
          ))}
      </Stack>
     );
}
 
export default GuestChatGroupsOutlet;