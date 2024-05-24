import { Paper, Typography, Divider, IconButton, Stack, Button } from '@mui/material';
import Icon from '../../../components/Icon';
import { dateConverter } from '../../../util';

const FollowRequestDialogItem = ({requestItem, approveFollowerHandler}) => {
     
    const nick = requestItem.follower ?
                 requestItem.follower.nick_name ?
                 requestItem.follower.nick_name :
                 requestItem.follower.first_name + ' ' + requestItem.follower.last_name :
                 '';

    const approveClickHandler = () => {
        approveFollowerHandler(requestItem.follower.id, true);
    } 
    const rejectClickHandler = () => {
        approveFollowerHandler(requestItem.follower.id, false);
    }
    
    return (
        <>
        {
            requestItem && 

                <Paper elevation={2} sx={{ mb: 2, px: 2, py: 1, minHeight: '160px' }}>
                <Typography variant='h6'>Follow Request</Typography>
                <Divider />
                <Stack direction='row'>
                    <Stack sx={{ alignItems: 'center' }}>
                        <IconButton sx={{p: 0, m: 1}}>
                            <Icon user={requestItem.follower} />
                        </IconButton>
                        <Typography>{nick}</Typography>
                    </Stack>
                    <Stack sx={{ p: 2 }}>
                        <Typography>New Follow Request From: {nick}</Typography>
                        <Typography>{dateConverter(requestItem.date)}</Typography>
                    </Stack>
                </Stack>
                <Stack direction='row' sx={{ justifyContent: 'flex-end', gap: '8px' }}>
                    <Button variant='contained' onClick={approveClickHandler}>Approve</Button>
                    <Button variant='outlined' onClick={rejectClickHandler}>Reject</Button>
        
                </Stack>
            </Paper>
        
        }        

    </>
        
      );
}
 
export default FollowRequestDialogItem;