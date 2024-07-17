import Post from '../../components/Post';
import { Stack, Card, CardContent, Typography } from '@mui/material';
import NewPostButton from '../../components/NewPostButton';
import NewPostDialog from '../../dialogs/NewPostDialog';
import { useState } from 'react';
import { ProvideUser } from '../../context/UserContext';
import { ProvidePosts } from '../../context/PostsContext';

const Home = () => {

    const [posts] = ProvidePosts();
    const [user] = ProvideUser();
    const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
    const newPostDialogCloseHandler = () => setNewPostDialogOpen(false);
    const newPostButtonClickHandler = () => setNewPostDialogOpen(true);
   
    return (
        <>
            {user &&
                <Stack spacing={3} sx={{ width: '100%', display: 'flex', alignItems: 'center', mt: 12, mb: 2 }}>
                    <NewPostButton clickHandler={newPostButtonClickHandler} tooltip="New Post" />
                    <NewPostDialog open={newPostDialogOpen} closeDialogHandler={newPostDialogCloseHandler} />
                    {
                        posts && posts.map(post => {
                            return (
                                <Post post={post} key={post.id} />
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
export default Home;