import { ProvidePosts } from "../../../context/PostsContext";
import Post from "../../../components/Post";
import { AUTHORIZATION, NO_USER_FOUND } from "../../../constants";
import { Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import InfoCard from "./InfoCard";
import { useEffect } from "react";

const Posts = ({person_id, submitCommentHandler, submitCommentError}) => {
    const [posts, reloadPosts, error] = ProvidePosts();

    useEffect(() => {
        reloadPosts(); 
    },[person_id]);

    return (
        <>
            {
                error ?
                    error.type === AUTHORIZATION ?
                        <InfoCard title='Private Account' message='This profile is private. Follow user to get access.' color='#FF0000' />
                        :
                        error.type === NO_USER_FOUND ?
                            <Typography> <Navigate to={'/signin'} /></Typography>
                            :
                            <InfoCard title='Error:' message={error} color='#FF0000' />
                    : posts ?
                    posts.length > 0 ? posts.map(post => <Post key={post.id} post={post} submitCommentHandler={submitCommentHandler} submitCommentError={submitCommentError}/>)
                    :
                        <InfoCard title='No Posts' message='All you post will appear in this section' color='#16c980' />
                    :
                    <></>
            }

        </>
    )
}

export default Posts;