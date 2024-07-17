import { ProvideGuestData } from '../components/GuestDataContext';
import { Stack, Card, CardContent, Typography } from '@mui/material';
import GuestNewPostButton from '../components/GuestNewPostButton';
import { useEffect, useState } from 'react';
import GuestPost from '../components/GuestPost';
import GuestNewPostDialog from '../components/GuestNewPostDialog';


const HomeGuest = () => {   


    const [
        user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms,
        groups, setGroups,
        events, setEvents,
        joinGroupRequests, setJoinGroupRequests] = ProvideGuestData();

    const [sorted, setSorted] = useState([]);

    useEffect(() => {

        const filtered = [];

        posts.forEach(post => {
            if(post.group_id){
                const group = groups.find(g => g.id === post.group_id);
                if(group){
                    const member = group.members.find(m => m.id === user.id) || group.creator.id === user.id;
                    if(Boolean(member)){
                        filtered.push(post);
                    }
                } 
              
            } else {
                filtered.push(post);
            }
        });

        const sorted = filtered.sort((a,b) => a.date < b.date ? 1 : -1);
        setSorted(sorted);
    },[posts]);

  
    const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
    const newPostDialogCloseHandler = () => setNewPostDialogOpen(false);
    const newPostButtonClickHandler = () => setNewPostDialogOpen(true);

   
    return (
        <>
             {user &&
                <Stack spacing={3} sx={{ width: '100%', display: 'flex', alignItems: 'center', mt: 12, mb: 2 }}>
                    <GuestNewPostButton clickHandler={newPostButtonClickHandler} tooltip="New Post" />                  
                    <GuestNewPostDialog open={newPostDialogOpen} closeDialogHandler={newPostDialogCloseHandler} /> 
                    {
                        sorted && sorted.map(post => {

                            if(post.privacy === 'public'){
                                return (
                                    <GuestPost post={post}  key={post.id} />
                                )
                            } else if(post.privacy === 'friends'){
                                //Check that friends
                                const areFriends = followers.filter(item => {
                                    return (item.followerId == post.sender.id && item.followeeId === user.id && item.status === 'approved') ||
                                           (item.followeeId == post.sender.id && item.followerId === user.id && item.status === 'approved')
                                 }).length > 0;
                                 
                                 if(areFriends){
                                    return <GuestPost post={post}  key={post.id} />
                                 }
                            }

                        })
                    }
                    {
                        !posts || posts.length === 0 &&
                        <Card sx={{ width: '500px', minHeight: '200px', mb: 2 }}>
                        <CardContent>
                            <Stack alignItems='center' sx={{pt: 3}}>
                                <Typography variant='h5'>No Posts</Typography>
                           </Stack>
                        </CardContent>
                        </Card>
                    }
                </Stack>
            } 
        </>
    )
}
 
export default HomeGuest;