
import { Tooltip, Card, CardContent, Stack, TextField, IconButton } from '@mui/material';
import GuestIcon from './GuestIcon';
import { ProvideGuestData } from './GuestDataContext';

const GuestNewPostButton = ({ clickHandler, sx }) => {

    const [user] = ProvideGuestData();

   // const [user, notifications, setNotifications, posts] = ProvideGuestData();

    const name = user ? (user.nick_name ? user.nick_name : user.first_name) : '';

    return (
        <Tooltip title='New Post'>
            <Card onClick={clickHandler} sx={{ width: '500px', height: '80px', ...sx}}>
                <CardContent>
                    <Stack direction='row' sx={{ width: '100%', alignItems: 'center' }}>
                        <IconButton aria-label="user icon" sx={{ width: '48px', height: '48px', mr: 2 }}>
                            <GuestIcon user={user} />
                        </IconButton>
                        <TextField
                            placeholder={`What't on your mind, ${name}?`}
                            readOnly
                            sx={{ width: '100%' }}
                            InputProps={{ sx: { borderRadius: '21px', height: '42px' } }}
                        ></TextField>
                    </Stack>
                </CardContent>
            </Card>
        </Tooltip>
    );
}
export default GuestNewPostButton;