import ContactsItem from "./ContactsItem";
import { ProvideChatMessages } from "../context/ChatMessagesContext";
import { useEffect, useState } from "react";
import { Stack } from "@mui/material";

const ContactsOutlet = ({contacts, newPrivateChatMessage, contactClickHandler}) => {

    const [chatMessages, reloadChatMessages] = ProvideChatMessages();

    useEffect(() => {
        reloadChatMessages();
    },[newPrivateChatMessage, contacts]);

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
                    <ContactsItem
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
 
export default ContactsOutlet;