import { Badge, Stack, Typography } from "@mui/material";
import Icon from "./Icon";
import { UserProvider } from "../context/UserContext";
// import { ProvideChatMessages } from "../context/ChatMessagesContext";
// import { useState, useEffect } from "react";

const ContactsItem = ({ contact, onClick, unread }) => {

  //console.log('contact item ',contact)

  //const [chatMessages] = ProvideChatMessages();
  //const [unread, setUnread] = useState(0);

  // useEffect(() => {
  //   setUnread(0);
  //   if(chatMessages) {    
  //     chatMessages.forEach(m => {
  //         if(
  //           !m.chat_group &&
  //           m.sender.id === contact.id &&
  //           !m.is_read
  //         ) {
  //           setUnread(prev => prev +1)
  //         }
  //     });
  //   }
  // },[chatMessages])

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        p: 1,
        mb: 1,
        "&:hover": {
          cursor: "pointer",
          background: "#eeeeee",
        },
      }}
      onClick={() => onClick(contact)}
    >
      <UserProvider person_id={contact.id}>
        <Badge
            color="secondary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                overlap="circular"
          badgeContent={unread}
        >
          <Icon />
        </Badge>      
      </UserProvider>
      <Typography variant="subtitle1">{contact.name}</Typography>
    </Stack>
  );
};

export default ContactsItem;
