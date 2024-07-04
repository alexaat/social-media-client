import { useNavigate } from 'react-router-dom';
import { ProvideGuestData } from '../components/GuestDataContext';
import { Stack, Card, CardContent, Typography, imageListClasses } from '@mui/material';
import GuestNewPostButton from '../components/GuestNewPostButton';
import { useEffect, useState, useRef } from 'react';
import GuestPost from '../components/GuestPost';
import GuestNewPostDialog from '../components/GuestNewPostDialog';


const HomeGuest = () => {
    
    // const [posts] = ProvidePosts();
    // const [user] = ProvideUser();

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

   

    const triggered = useRef(false);

    useEffect(() => {

        // if(!triggered.current){
        //     triggered.current = true;
        //     followRequest();

        // }

        // if(localStorage.getItem("guest_user_session1") === null){
        //     localStorage.setItem("guest_user_session1", true);
        //     followRequest();
        // }
    },[]);

  
    const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
    const newPostDialogCloseHandler = () => setNewPostDialogOpen(false);
    const newPostButtonClickHandler = () => setNewPostDialogOpen(true);

    const sorted = posts.sort((a, b) => {
        if(a.id<b.id){
            return 1
        }
        return -1;
    })
    
    
    return (
        <>
             {user &&
                <Stack spacing={3} sx={{ width: '100%', display: 'flex', alignItems: 'center', mt: 3, mb: 2 }}>
                    <GuestNewPostButton clickHandler={newPostButtonClickHandler} tooltip="New Post" />
                    {/* <NewPostDialog open={newPostDialogOpen} closeDialogHandler={newPostDialogCloseHandler} /> */}
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