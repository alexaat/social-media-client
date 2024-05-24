import { CardContent, Card, Stack, Typography } from "@mui/material";
import { ProvidePosts } from "../context/PostsContext";
import Post from "./Post";
import { useEffect } from "react";
import { AUTHORIZATION } from "../constants";

const GroupPosts = ({ group_id, reload, submitCommentHandler }) => {
   const [posts, reloadPosts, error] = ProvidePosts();

   useEffect(() => {
      reloadPosts()
   }, [group_id, reload])


   let component = <></>;

   if(error && error.type === AUTHORIZATION) {
      component = 
      <Card sx={{ width: '100%', height: '350px', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <CardContent >
            <Stack >
               <Typography variant="h5">Join group in order to see posts</Typography>

            </Stack>
         </CardContent>
      </Card>
   }

   if(!error && posts && posts.length === 0) {
      component = 
      <Card sx={{ width: '100%', height: '350px', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <CardContent >
            <Stack >
               <Typography variant="h5">No Posts</Typography>    
            </Stack>
         </CardContent>
      </Card>
   }

   if(posts && posts.length > 0) {
      component = posts.map(post => <Post post={post} sx={{ width: '100%' }} key={post.id} submitCommentHandler={submitCommentHandler} />)
   }
   return (
      <Stack>
         {component}
      </Stack>
   );
}

export default GroupPosts;