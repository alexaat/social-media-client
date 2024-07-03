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

    const followRequest = () => {
        console.log('home')
        setTimeout(() => {
            //1. Add Notification
            setNotifications(prev => {
              const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
              const sender = users.find(u=> u.id === 2);
              const content = 
                  user.privacy === 'private'
                  ?
                  'You have a follower request from ' + sender.display_name
                  :
                  user.privacy === 'public'
                  ?
                  'You have a new follower: ' + sender.display_name
                  :
                  ''; 

              const notification = {
                  id,
                  content,
                  date:  Date.now(),
                  sender,
                  is_read: false
              }
                  return [...prev, notification];
            })

            //2. Add follower
            const status = user.privacy === 'private' ? 'pending' : 'approved'; 
            const follower = {
              followerId: 2,
              followeeId: 1,
              date: Date.now(),
              status
            } 

            setFollowers(prev => {
               const filtered = prev.filter(f => !(f.followeeId === 1 && f.followerId === 2));
               return [...filtered, follower];
            })

         }, 10000); 
    }

    const triggered = useRef(false);

    useEffect(() => {

        if(!triggered.current){
            triggered.current = true;
            followRequest();

        }

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
                            return (
                                <GuestPost post={post}  key={post.id} />
                            )
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