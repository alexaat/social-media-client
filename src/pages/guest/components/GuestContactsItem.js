import { Badge, Stack, Typography } from "@mui/material";
import { ProvideGuestData } from "./GuestDataContext";
import GuestIcon from './GuestIcon';


const GuestContactsItem = ({ contact, onClick, unread }) => {

  const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData(); 

  const person = users.find(u => u.id === contact.id);


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
      onClick={() => onClick(contact)}    >     
        <Badge
            color="secondary"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                overlap="circular"
          badgeContent={unread}
        >
          <GuestIcon user={person}/>
        </Badge>      
      <Typography variant="subtitle1">{contact.name}</Typography>
    </Stack>
  );
};

export default GuestContactsItem;
