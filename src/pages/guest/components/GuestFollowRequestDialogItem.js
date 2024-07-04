import { Paper, Typography, Divider, IconButton, Stack, Button } from '@mui/material';
import Icon from '../../../components/Icon';
import { dateConverter } from '../../../util';
import GuestIcon from '../components/GuestIcon';
import { ProvideGuestData } from '../components/GuestDataContext';

const GuestFollowRequestDialogItem = ({requestItem}) => {
    
    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();
     
    const follower = users.find(u => u.id === requestItem.followerId);

    const approveClickHandler = () => {
        
        setNotifications(prev => {
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
          
            const notification = {
                id,
                content:'You have a new follower: ' + follower.display_name,  
                date:  Date.now(),
                sender: follower,
                is_read: false
            }
                return [...prev, notification];
          });       
        
        
        setFollowers(prev => {
            return prev.map(item => {
                if(item.followerId === requestItem.followerId && item.followeeId === requestItem.followeeId){
                    return {...item, status: 'approved'}
                }
                return item;
            });
        })

    } 
    const rejectClickHandler = () => {

        setNotifications(prev => {
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
          
            const notification = {
                id,
                content:'Follow request denied for: ' + follower.display_name,  
                date:  Date.now(),
                sender: follower,
                is_read: false
            }
                return [...prev, notification];
          });       
        

        setFollowers(prev => {
            return prev.filter(item => !(item.followerId === requestItem.followerId && item.followeeId === requestItem.followeeId))
        })
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
                            <GuestIcon user={follower} />
                        </IconButton> 
                        <Typography>{follower.display_name}</Typography>
                    </Stack>
                    <Stack sx={{ p: 2 }}>
                        <Typography>New Follow Request From: {follower.display_name}</Typography>
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
 
export default GuestFollowRequestDialogItem;