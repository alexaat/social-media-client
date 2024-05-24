import { Typography, IconButton, Menu, Stack,  Divider } from "@mui/material";
import ChatItemsOutlet from "../components/ChatItemsOutlet";
import { ProvideChatMessages } from "../context/ChatMessagesContext";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";


const ChatsMenu = ({ancor, onClose, newChatMessageClickHandler, chatSelectedHandler}) => {

    const [chatMessages] = ProvideChatMessages();
    
    return ( 
        <Menu
        slotProps={{
          paper: {
            sx: {
              width: "350px",
            },
          },
        }}
        open={Boolean(ancor)}
        anchorEl={ancor}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Stack
          spacing={2}
          sx={{ ml: 2, mr: 2 }}
          direction="row"
          justifyContent="space-between"
        >
          <Typography variant="h5">Chats</Typography>
          <IconButton
            disableFocusRipple
            disableRipple
            sx={{ p: 0, m: 0 }}
            aria-label="new chat message button"
            onClick={newChatMessageClickHandler}
          >
            <EditNoteRoundedIcon />
          </IconButton>
        </Stack>

        <Divider />
        {!chatMessages || chatMessages.length === 0 ? (
          <Stack sx={{ px: 2 }}>
            <Typography variant="body1" sx={{ py: 1 }}>
              No Chats
            </Typography>
          </Stack>
        ) : (
          <ChatItemsOutlet
            chats={chatMessages}
            chatSelectedHandler={chatSelectedHandler}
          />
        )}
      </Menu>
    );
}
 
export default ChatsMenu;