import GuestContactsItem from "./GuestContactsItem";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

const GuestContactsOutlet = ({contacts, newPrivateChatMessage, contactClickHandler}) => {

    

    const chatMessages = [];
    //const [chatMessages, reloadChatMessages] = ProvideChatMessages();

    // useEffect(() => {
    //     reloadChatMessages();
    // },[newPrivateChatMessage, contacts]);

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