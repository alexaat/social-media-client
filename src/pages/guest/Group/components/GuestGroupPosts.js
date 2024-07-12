import { CardContent, Card, Stack, Typography } from "@mui/material";
import GuestPost from "../../components/GuestPost";
import { useEffect, useState } from "react";
import { AUTHORIZATION } from "../../../../constants";
import { ProvideGuestData } from "../../components/GuestDataContext";

const GuestGroupPosts = ({ group_id, submitCommentHandler }) => {

const [error, setError] = useState();

const [
    user,
    notifications, setNotifications,
    posts, setPosts,
    users, setUser,
    followers, setFollowers,
    chatMessages, setjChatMessages,
    chatRooms, setChatRooms,
    groups, setGroups] = ProvideGuestData();

    const [filteredPosts, setFilteredPosts] = useState([]);


    useEffect(() => {
        setError();
        const group  = groups.find(g => g.id == group_id);        
        if(!group){
            setError({type: 'data source', message: 'Error: cannot find group'})
        } else {
            const member = group.members.find(m => m.id === user.id) || group.creator.id === user.id
            if(!member){
              setError({type: AUTHORIZATION, message: 'Error: not group member'})
            }
        }

        setFilteredPosts(posts.filter(post => post.group_id && post.group_id == group_id));

    }, [groups, group_id, posts]);
   
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

   if(!error && filteredPosts && filteredPosts.length === 0) {
      component = 
      <Card sx={{ width: '100%', height: '350px', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <CardContent >
            <Stack >
               <Typography variant="h5">No Posts</Typography>    
            </Stack>
         </CardContent>
      </Card>
   }

   if(!error && filteredPosts && filteredPosts.length > 0) {
      const sorted = filteredPosts.sort((a,b) => a.id <  b.id ? 1 : -1);
      component = sorted.map(post => <GuestPost post={post} sx={{ width: '100%' }} key={post.id} submitCommentHandler={submitCommentHandler} />)
   }
   return (
      <Stack>
         {component}
      </Stack>
   );
}

export default GuestGroupPosts;