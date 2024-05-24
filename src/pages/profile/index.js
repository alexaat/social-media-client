import { useNavigate, useParams } from "react-router-dom";
import { Grid, Skeleton, IconButton, Box, Typography, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { ProvideUser, UserProvider } from '../../context/UserContext';
import Icon from '../../components/Icon';
import { getCookie, SESSION_ID } from '../../cookies';
import { serverHost } from '../../constants';
import PrivacyToggle from "./components/PrivacyToggle";
import FollowToggle from "./components/FollowToggle";
import ProfileBio from "./components/ProfileBio";
import FollowersSummary from "./components/FollowersSummary";
import FollowRequestDialog from "./components/FollowRequestDialog";
import { PostsProvider } from "../../context/PostsContext";
import Posts from "./components/Posts";
import { FollowersProvider } from "../../context/FollowersContext";
import { FollowingsProvider } from "../../context/FollowingsContext";

const ProfilePage = () => {

    const { person_id } = useParams();

    const [user, reloadUser] = ProvideUser();

    const [privacy, setPrivacy] = useState(null);

    const privacyChangeHandler = (event, value) => {

        if (value) {

            setPrivacy(value);

            const session_id = getCookie(SESSION_ID);

            fetch(serverHost + '/user?' + new URLSearchParams({ session_id }),
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams({
                        privacy: value
                    })
                })
                .then(resp => resp.json())
                .then(data => {
                    console.log(`Profile Page Response: ${JSON.stringify(data)}`)
                    if (!data) {
                        throw new Error("Couldn't fetch data: No data prop");
                    }
                    if (data.error) {
                        throw new Error(data.error.message);
                    }
                    if (!data.payload) {
                        throw new Error("Couldn't fetch data: No payload prop");
                    }
                    reloadUser();
                })
                .catch(err => alert(err));
        }
    }
    const navigate = useNavigate();

    const [image, setImage] = useState();

    useEffect(() => {
        if (person_id && user && person_id === user.id.toString()) {
            navigate('/profile');

        }
        const image = new Image();
        image.src = "https://source.unsplash.com/random";
        image.onload = () => setImage(image);


    }, [user, person_id]);

    let posts = <></>;

    if (person_id && user) {
        if (person_id === user.id) {
            posts =
                <PostsProvider person_id={user.id}>
                    <Posts/>
                </PostsProvider>
        } else {
            posts =
                <PostsProvider person_id={person_id}>
                    <Posts person_id={person_id}/>
                </PostsProvider>
        }
    }

    if (person_id === undefined && user) {
        posts =
            <PostsProvider person_id={user.id}>
                <Posts />
            </PostsProvider>
    }

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
                                    src={image.src}
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
                                {person_id
                                    ?
                                    <UserProvider person_id={person_id}>
                                        <Icon size='128px' sx={{ border: '2px solid white' }} />
                                    </UserProvider>
                                    :
                                    <Icon size='128px' sx={{ border: '2px solid white' }} />
                                }
                            </IconButton>
                        </Grid>
                        <Grid item sx={{ mt: 1 }} mr={{ xs: 1, md: 0 }}>

                            {person_id
                                ?
                                person_id && user && person_id !== user.id.toString() ? <FollowToggle person_id={person_id} /> : <></>
                                :
                                <Stack alignItems='flex-end'>
                                    <Typography variant="body1" sx={{ color: '#444' }}>Profile status: {user && user.privacy}</Typography>
                                    <Stack>
                                        <PrivacyToggle
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
                                    {
                                        person_id
                                            ?
                                            <UserProvider person_id={person_id}>
                                                <ProfileBio/>
                                            </UserProvider>
                                            :
                                            <ProfileBio />
                                    }

                                </Grid>
                                <Grid item sx={{ mt: 1 }} mx={{ xs: 1, md: 0 }}>
                                    {
                                        person_id
                                            ?
                                            <FollowersProvider person_id={person_id}>
                                                <FollowingsProvider person_id={person_id}>
                                                    <FollowersSummary />
                                                </FollowingsProvider>
                                            </FollowersProvider>
                                            :
                                            <FollowersSummary />

                                    }

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
                            {!person_id && <FollowRequestDialog />}

                            {posts}


                        </Grid>
                    </Grid>


                </Grid>

            </Grid>
        </Grid>

    );
}

export default ProfilePage;