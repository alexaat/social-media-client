import { Stack, Typography, Badge } from "@mui/material";
import GuestIcon from "./GuestIcon";
import { dateConverter } from "../../../util";

const GuestChatItem = ({ chat, handleClick }) => {
  const display_name = chat.chat_group
    ? chat.sender.display_name + " / " + chat.chat_group.title
    : chat.sender.display_name;

  return (
    <Stack
      direction="row"
      alignItems={"center"}
      spacing={2}
      sx={{
        px: 2,
        mt: 2,
        width: "100%",
        "&:hover": {
          cursor: "pointer",
          background: "#eeeeee",
        },
      }}
      onClick={() => handleClick(chat)}
    >
      <Badge
        color="secondary"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        overlap="circular"
      >
        <GuestIcon user={chat.sender} />
      </Badge>

      <Stack sx={{ width: "100%", overflow: "hidden", pr: 2 }}>
        <Stack alignItems="end">
          <Typography
            variant="body1"
            sx={{ fontSize: "12px", lineHeight: "8px", pt: "4px", pr: 1 }}
          >
            {dateConverter(chat.date)} ago
          </Typography>
        </Stack>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {display_name}
        </Typography>
        <Stack>
          <Typography
            variant="body1"
            noWrap
            sx={{
              color: "#aaaaaa",
            }}
          >
            {chat.content}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default GuestChatItem;
