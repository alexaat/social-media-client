// import { useNavigate, useParams } from "react-router-dom";
// const ProfileGuest = () => {    
//     const { person_id } = useParams();   
//     return (
//         <div>
//             Profile for {person_id}
           
//         </div>
//       );
// } 
// export default ProfileGuest;

import { useNavigate, useParams } from "react-router-dom";
import { Grid, Skeleton, IconButton, Box, Typography, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
// import { ProvideUser, UserProvider } from '../../context/UserContext';
// import Icon from '../../components/Icon';
// import { getCookie, SESSION_ID } from '../../cookies';
// import { serverHost } from '../../constants';
// import PrivacyToggle from "./components/PrivacyToggle";
// import FollowToggle from "./components/FollowToggle";
// import ProfileBio from "./components/ProfileBio";
// import FollowersSummary from "./components/FollowersSummary";
// import FollowRequestDialog from "./components/FollowRequestDialog";
// import { PostsProvider } from "../../context/PostsContext";
// import Posts from "./components/Posts";
// import { FollowersProvider } from "../../context/FollowersContext";
// import { FollowingsProvider } from "../../context/FollowingsContext";
import defaultBackground from '../../../assets/default_background.jpg';
import { imageURL } from "../../../constants";
import { ProvideGuestData } from '../components/GuestDataContext';
import GuestIcon from '../components/GuestIcon';
import GuestPrivacyToggle from '../components/GuestPrivacyToggle';
import GuestFollowToggle from '../components/GuestFollowToggle';
import GuestProfileBio from "../components/GuestProfileBio";

const ProfileGuest = () => {

    const { person_id } = useParams();

    const [user, notifications, setNotifications, posts, setPosts, users, setUser] = ProvideGuestData();

    const person = person_id === undefined ? user : users.filter(u => u.id == person_id)[0]

    // const [user, reloadUser] = ProvideUser();

    const [privacy, setPrivacy] = useState(null);

    const [src, setSrc] = useState(imageURL);

    const privacyChangeHandler = (event, value) => {

        if (value) {

            setPrivacy(value);

            setUser(prev => {
                return {...prev, privacy: value}
            })
            

            // const session_id = getCookie(SESSION_ID);

            // fetch(serverHost + '/user?' + new URLSearchParams({ session_id }),
            //     {
            //         method: 'PATCH',
            //         headers: {
            //             'Accept': 'application/json'
            //         },
            //         body: new URLSearchParams({
            //             privacy: value
            //         })
            //     })
            //     .then(resp => resp.json())
            //     .then(data => {                  
            //         if (!data) {
            //             throw new Error("Couldn't fetch data: No data prop");
            //         }
            //         if (data.error) {
            //             throw new Error(data.error.message);
            //         }
            //         if (!data.payload) {
            //             throw new Error("Couldn't fetch data: No payload prop");
            //         }
            //         reloadUser();
            //     })
            //     .catch(err => alert(err));
        }
    }
    // const navigate = useNavigate();

    const [image, setImage] = useState();

    useEffect(() => {
        // if (person_id && user && person_id === user.id.toString()) {
        //     navigate('/profile');

        // }
        const image = new Image();
        image.src = imageURL;
        image.onload = () => setImage(image);
        image.onerror = () =>{
            setSrc(defaultBackground);
            setImage(true);
        }
    }, []);

    // let posts = <></>;

    // if (person_id && user) {
    //     if (person_id === user.id) {
    //         posts =
    //             <PostsProvider person_id={user.id}>
    //                 <Posts/>
    //             </PostsProvider>
    //     } else {
    //         posts =
    //             <PostsProvider person_id={person_id}>
    //                 <Posts person_id={person_id}/>
    //             </PostsProvider>
    //     }
    // }

    // if (person_id === undefined && user) {
    //     posts =
    //         <PostsProvider person_id={user.id}>
    //             <Posts />
    //         </PostsProvider>
    // }

    return (
        <Grid container justifyContent='center' sx={{ pb: 1 }}>
            <Grid item xs={12} md={10}>
                <Grid container direction='column' >
                    {/* Top Image */}
                    {
                        image ?
                            <Grid item>
                                <Box
                                    height="140px"
                                    width='100%'
                                    component="img"
                                    src={src}
                                    alt="image on profile page"
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Grid>
                            :
                            <Grid item>
                                <Skeleton variant="rectangular" height="140px" width='100%' />
                            </Grid>
                    }
                    <Grid container justifyContent='space-between' direction='row'>
                        <Grid item>
                            <IconButton sx={{ width: '128px', height: '128px', ml: '64px', mt: '-64px' }} disabled>
                                {/* {person_id
                                    ?
                                    <UserProvider person_id={person_id}>
                                        <Icon size='128px' sx={{ border: '2px solid white' }} />
                                    </UserProvider>
                                    :
                                    <Icon size='128px' sx={{ border: '2px solid white' }} />
                                } */}
                                <GuestIcon size='128px' sx={{ border: '2px solid white' }}  user={person}/>

                            </IconButton>
                        </Grid>
                        <Grid item sx={{ mt: 1 }} mr={{ xs: 1, md: 0 }}>

                            {   person_id
                                ?
                                person_id && user && person_id !== user.id.toString() ? <GuestFollowToggle person_id={person_id} /> : <></>
                                :
                                <Stack alignItems='flex-end'>
                                    <Typography variant="body1" sx={{ color: '#444' }}>Profile status: {user && user.privacy}</Typography>
                                    <Stack>
                                        <GuestPrivacyToggle
                                            privacy={privacy}
                                            user={user}
                                            privacyChangeHandler={privacyChangeHandler}
                                        />
                                    </Stack>
                                </Stack>
                            } 
                        </Grid>
                    </Grid>

                    <Grid container justifyContent='space-between' direction='row'>
                        {/*left side: bio and followers */}
                        <Grid item xs={12} md={4}>
                            <Grid container direction='column' sx={{ mt: 1 }}>
                                <Grid item mx={{ xs: 1, md: 0 }}>                                                                       
                                    <GuestProfileBio person_id={person_id}/>
                                </Grid>
                                <Grid item sx={{ mt: 1 }} mx={{ xs: 1, md: 0 }}>
                                    {/* {
                                        person_id
                                            ?
                                            <FollowersProvider person_id={person_id}>
                                                <FollowingsProvider person_id={person_id}>
                                                    <FollowersSummary />
                                                </FollowingsProvider>
                                            </FollowersProvider>
                                            :
                                            <FollowersSummary />

                                    } */}

                                </Grid>
                            </Grid>
                        </Grid>

                        {/*right side: posts */}
                        <Grid item xs={12} md={8}
                            sx={{
                                pl: 1,
                                pt: 1,
                            }}
                            mr={{ xs: 1, md: 0 }}
                        >
                            {/* Follow request */}
                            {/* {!person_id && <FollowRequestDialog />}

                            {posts} */}


                        </Grid>
                    </Grid>


                </Grid>

            </Grid>
        </Grid>

    );
}

export default ProfileGuest;


