import { Typography, Stack, IconButton } from "@mui/material";
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
// import Icon from "./Icon";
import { dateConverter } from "../../../util";
import GuestIcon from '../components/GuestIcon';

const GuestNotificationItem = ({ notification, itemClickHandler, readClickHandler, iconClickHandler }) => {

    return (
        <Stack direction='row' alignItems='center' sx={{ width: '100%' }}>
            { <IconButton sx={{ p: 0, mr: 2 }} onClick={() => iconClickHandler(notification.sender.id)}>
                <GuestIcon user={notification.sender} />
            </IconButton> }

            <Stack sx={{ width: '100%' }}>
                <Typography variant='subtitle1'>{notification.content}</Typography>
                <Typography variant='subtitle2' sx={{ fontSize: '0.8rem' }}>{dateConverter(notification.date)}</Typography>
                {
                    // notification.event && <Typography>{notification.event.title}</Typography>
                }
                {
                    // notification.group && !notification.event && <Typography>{notification.group.title}</Typography>
                }            
            </Stack>

            {!notification.is_read &&
                <IconButton sx={{ ml: 2, p: 0 }} onClick={() => readClickHandler(notification)}>
                    <CircleRoundedIcon color='primary' sx={{ width: '12px', height: '12px' }} />
                </IconButton>
            }
        </Stack>
    );
}

export default GuestNotificationItem;