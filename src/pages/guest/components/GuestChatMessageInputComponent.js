import { IconButton, Stack, TextField, InputAdornment } from "@mui/material";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';

const GuestChatMessageInputComponent = ({ sendHandler }) => {

    const [message, setMessage] = useState('');

    const [openEmojiDialog, setOpenEmojiDialog] = useState(false);
    const selectEmojiHandler = (event) => {
        setMessage(prev => prev + event.emoji)
    }

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSend = () => {
        sendHandler(message);
        setMessage('');
        setOpenEmojiDialog(false);
    }

    return (
        <Stack>
            <Stack direction='row' justifyContent='space-between' spacing={2}>
                <TextField
                    value={message}
                    label="Your message"
                    variant="standard"
                    sx={{ width: '100%' }}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton disableRipple onClick={handleSend}>
                                    <SendRoundedIcon color='primary' />
                                </IconButton>
                            </InputAdornment>
                        ),
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton disableRipple onClick={() => setOpenEmojiDialog(!openEmojiDialog)}>
                                    <EmojiEmotionsRoundedIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

            </Stack>
            <EmojiPicker onEmojiClick={selectEmojiHandler} open={openEmojiDialog} />
        </Stack>
    );
}
export default GuestChatMessageInputComponent;