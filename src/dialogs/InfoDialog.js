import { Typography, IconButton, Stack, Divider, Dialog, DialogActions, Button, DialogTitle, DialogContent, Box } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Icon from '../components/Icon';


const InfoDialog = (
    {
        dialogOpen,
        dialogCloseHandler,
        title,
        message,
        user
    }

) => {
    return (

        <Dialog
            open={dialogOpen}
            onClose={dialogCloseHandler}
            sx={{ p: 0, m: 0 }}
        >
            <DialogTitle>
                <Stack direction='row'>
                    <Typography variant="h5">{title}</Typography>
                </Stack>
                <IconButton sx={{ position: 'absolute', right: '8px', top: '8px' }} onClick={dialogCloseHandler}>
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ width: '400px' }}>
                <Stack direction='row' alignItems='center'>
                    <Stack alignItems='center'>
                        <IconButton disabled>
                            <Icon user={user} />
                        </IconButton>
                        <Typography variant="body1"> {user && (user.nick_name ? user.nick_name : `${user.first_name} ${user.last_name}`)}</Typography>
                    </Stack>
                    <Typography sx={{ml: 2}}>{message}</Typography>
                </Stack>

            </DialogContent>

            <DialogActions>
                <Button onClick={dialogCloseHandler}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default InfoDialog;