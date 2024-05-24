import { Typography, IconButton, Stack, Divider, Dialog, DialogActions, Button, DialogTitle, DialogContent } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Icon from '../components/Icon';

const ApproveFollowerDialog = ({
    approveFollowerDialogOpen,
    approveFollowerDialogCloseHandler,
    approveFollowerHandler,
    user
}) => {
    return (
        <Dialog
            open={approveFollowerDialogOpen}
            onClose={approveFollowerDialogCloseHandler}
            sx={{ p: 0, m: 0 }}
        >
            <DialogTitle>
                <Stack direction='row' alignItems='center' justifyContent='center'>
                    <Typography variant="h5">Approve follower</Typography>
                </Stack>
                <IconButton sx={{ position: 'absolute', right: '8px', top: '8px' }} onClick={approveFollowerDialogCloseHandler}>
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ width: '400px' }}>
                <IconButton disabled>
                    <Icon user={user} />
                </IconButton>
                <Typography variant="body1"> {user && (user.nick_name ? user.nick_name : `${user.first_name} ${user.last_name}`)}</Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={() => approveFollowerHandler(true)}>Approve</Button>
                <Button onClick={() => approveFollowerHandler(false)}>Refuse</Button>
            </DialogActions>
        </Dialog>

    );
}

export default ApproveFollowerDialog;