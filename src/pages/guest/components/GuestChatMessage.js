import { Stack, Typography } from "@mui/material";
import { formatMilli } from "../../../util";
import { ProvideGuestData } from "./GuestDataContext";

const GuestChatMessage = ({sender_id, title, text, date}) => {

   const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers, chatMessages, setChatMessages] = ProvideGuestData();

   let position = 'left';
   let borderRadius = '0px 8px 8px 8px'
   let borderColor = '#cccccc'

    let display_name = '';
    if (user) {
        if(user.id === sender_id) {
            display_name = title + ' (You)';
            position = 'right';
            borderRadius = '8px 0px 8px 8px';
            borderColor = 'primary.main'
        } else {
            display_name = title;
        }
    }

    return (
        <Stack sx={{width: '100%'}} direction='row' justifyContent={position}>
            <Stack spacing={1.5} sx={{px: 1, border: '1px solid', borderColor, width: '75%', borderRadius: {borderRadius}}}>
                <Stack direction='row' justifyContent='space-between' alignItems='end' sx={{borderBottom: '1px solid', borderColor}} >
                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>{display_name}</Typography>  
                    <Typography variant='body2' sx={{fontSize: '10px'}}>{formatMilli(date)}</Typography>  
                </Stack>
                <Typography variant='body1'>{text}</Typography> 
            
            </Stack>
        </Stack>
     );
}
 
export default GuestChatMessage;