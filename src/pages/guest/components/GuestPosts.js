import { ProvidePosts } from "../../../context/PostsContext";
import Post from "../../../components/Post";
import { AUTHORIZATION, NO_USER_FOUND } from "../../../constants";
import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
// import InfoCard from "./InfoCard";
import { useEffect } from "react";
import { ProvideGuestData } from "./GuestDataContext";
import GuestInfoCard from "./GuestInfoCard";
import GuestPost from '../components/GuestPost';

const GuestPosts = ({person_id}) => {
  // const [posts, reloadPosts, error] = ProvidePosts();

  const [user, notifications, setNotifications, posts, setPosts, users, setUser] = ProvideGuestData();

  let components = <></>;
  const message = `All ${person_id ? 'new' : 'your'} posts will appear in this section`;
  const id = person_id ? person_id : user.id

  const filtered = posts.filter(post => post.sender.id == id);
  if(filtered.length === 0){
    components = <GuestInfoCard title='No Posts' message={message} color='#16c980' />
  } else {
    const sorted = filtered.sort((a,b) => (a.id<b.id ? 1 : -1))
    components = sorted.map(post => <GuestPost key={post.id} post={post}/>)
  }
  
  return (
      <> {components} </>
  )


    // useEffect(() => {
    //     reloadPosts(); 
    // },[person_id]);

    // return (
    //     <>
    //         {
    //             error ?
    //                 error.type === AUTHORIZATION ?
    //                     <InfoCard title='Private Account' message='This profile is private. Follow user to get access.' color='#FF0000' />
    //                     :
    //                     error.type === NO_USER_FOUND ?
    //                         <Typography> <Navigate to={'/signin'} /></Typography>
    //                         :
    //                         <InfoCard title='Error:' message={error} color='#FF0000' />
    //                 : posts ?
    //                 posts.length > 0 ? posts.map(post => <Post key={post.id} post={post} submitCommentHandler={submitCommentHandler} submitCommentError={submitCommentError}/>)
    //                 :
    //                     <InfoCard title='No Posts' message='All you post will appear in this section' color='#16c980' />
    //                 :
    //                 <></>
    //         }

    //     </>
    // )
}

export default GuestPosts;