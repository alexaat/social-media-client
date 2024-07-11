import GuestContactsItem from "./GuestContactsItem";
import { Stack } from "@mui/material";
import { ProvideGuestData } from "./GuestDataContext";

const GuestContactsOutlet = ({contacts, newPrivateChatMessage, contactClickHandler}) => {

    const [
        user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms] = ProvideGuestData();

    const calculateUnread = (contactId) => {
        let unread = 0;        
        if(chatMessages) {    
            chatMessages.forEach(m => {
                if(
                  !m.chat_group &&
                  m.sender.id === contactId &&
                  !m.is_read
                ) {
                    unread++;
                }
            });       
        return unread;
        }
    }   

    return (
        <Stack>
        {
            contacts.map(contact => (
                    <GuestContactsItem
                    unread={calculateUnread(contact.id)}
                    contact={contact}
                    key={contact.id}
                    onClick={(contact) => {
                        contact["type"] = "user";                        
                        contactClickHandler(contact);
                    }}
                />
            ))
        }       
        </Stack>
      );
}
 
export default GuestContactsOutlet;