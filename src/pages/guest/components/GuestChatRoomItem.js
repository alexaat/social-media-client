import { IconButton, Stack, Typography, Badge } from "@mui/material";
import GuestIcon from "./GuestIcon";
import { isValidUrl } from "../../../util";
import { useEffect, useState } from "react";

const GuestChatRoomItem = ({ room, clickHandler, unread }) => {

  const [src, setSrc] = useState(room.image);

  useEffect(() => {
    if(!isValidUrl(room.image)){
      setTimeout(() => {
        setSrc(localStorage.getItem(room.image));
      },500);     
    }
  },[src]);

  
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        py: 1,
        pl: 1,
        "&:hover": {
          cursor: "pointer",
          background: "#eeeeee",
        },
      }}
      onClick={() => clickHandler(room.id, room.title)}
    >
      <IconButton sx={{ p: 0 }}>
      <Badge
          color="secondary"
          anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
          }}
          overlap="circular"
          badgeContent={unread}
        >
          <GuestIcon user={{ display_name: room.title, avatar: src }} />
        </Badge>        
      </IconButton>
      <Typography>{room.title}</Typography>
    </Stack>
  );
};

export default GuestChatRoomItem;
