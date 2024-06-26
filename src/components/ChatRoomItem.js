import { IconButton, Stack, Typography, Badge } from "@mui/material";
import Icon from "./Icon";

const ChatRoomItem = ({ room, clickHandler, unread }) => {

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
          <Icon user={{ display_name: room.title, avatar: room.image }} />
        </Badge>        
      </IconButton>
      <Typography>{room.title}</Typography>
    </Stack>
  );
};

export default ChatRoomItem;
