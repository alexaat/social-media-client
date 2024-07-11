import {Stack, Button, Typography, Paper} from '@mui/material'
import GuestIcon from '../../components/GuestIcon'

const ApproveJoinGroupRequest = ({sx, user, group, approveHandler, declineHandler}) => {
    const approveClickListener = () => {
       if(approveHandler){ 
        approveHandler(user.id, group.id);   
        }
    }

    const declineClickListener = () => {
        if (declineHandler) {
            declineHandler(user.id, group.id);
        }       
    }
    
    return (  
        <Paper>
            <Stack sx={{...sx}}>
                <Stack direction='row' spacing={2} alignItems='top'>                    
                    <Stack>
                        <GuestIcon user={user} size='36px'/>
                        <Typography variant='body1'>{user.display_name}</Typography>
                    </Stack>
                    <Stack alignItems='center' sx={{ width: '100%'}}>
                        <Typography variant='body1'> request to join group: {group.title}</Typography>
                    </Stack>
                </Stack>             

                <Stack direction='row' sx={{mt: 2}} justifyContent='flex-end' spacing={1}>
                    <Button variant="contained" onClick={approveClickListener}>Approve</Button>
                    <Button variant="outlined" onClick={declineClickListener}>Decline</Button>
                </Stack>
            </Stack>
        </Paper>
    );
}
 
export default ApproveJoinGroupRequest;