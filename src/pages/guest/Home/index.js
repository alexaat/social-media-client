import { useNavigate } from 'react-router-dom';
import { ProvideGuestData } from '../components/GuestDataContext';
import { Stack, Card, CardContent, Typography } from '@mui/material';
import GuestNewPostButton from '../components/GuestNewPostButton';
import { useState } from 'react';
import GuestPost from '../components/GuestPost';
import GuestNewPostDialog from '../components/GuestNewPostDialog';

const HomeGuest = () => {
    
    // const [posts] = ProvidePosts();
    // const [user] = ProvideUser();

    const [user, notifications, setNotifications, posts] = ProvideGuestData();
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