import { Dialog, DialogContent, Button, Typography, Box, Snackbar, Alert, DialogActions, Avatar, TextField, DialogTitle, Divider } from '@mui/material';
import { AUTHORIZATION, serverHost } from '../constants';
import { getCookie, SESSION_ID } from '../cookies';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { buildImageUrl } from '../util.js';
import { ProvideFollowings } from '../context/FollowingsContext';
import { handleError } from '../errors';

const UserDetailsDialog = ({ open, setOpen, post }) => {

    const nick = post.user.nick_name ? post.user.nick_name : post.user.first_name + ' ' + post.user.last_name;

    //Navigation
    const navigate = useNavigate();

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');


    const [followings, reloadFollowings] = ProvideFollowings();


    let isFollowing = undefined;

    if (followings) {
        for (let i = 0; i < followings.length; i++) {

            const followingUserId = followings[i].following.id;
            const postUserId = post.user.id;

            if (followingUserId == postUserId) {
                isFollowing = followings[i].approved;
            }
        }
    }

    const setFollow = () => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate("/signin");
            return;
        }

        if (isFollowing === true) {
            //Unfollow

            fetch(serverHost + '/following?' + new URLSearchParams({ session_id, follow: post.user.id }),
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(resp => resp.json())
                .then(data => {

                    if (data.error) {
                        throw new Error(data.error)
                    }
                    // reloadFollowings();
                })
                .catch(err => handleError(err));

        } else if (isFollowing === undefined) {
            fetch(serverHost + '/following?' + new URLSearchParams({ session_id }),
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams({
                        follow: post.user.id
                    })
                })
                .then(resp => resp.json())
                .then(data => {

                    if (data.error) {
                        if (data.error.type === AUTHORIZATION) {
                            setSnackBarMessage(data.error.message);
                            setSnackBarOpen(true);
                            //reloadFollowings();
                        } else {
                            throw new Error(data.error);
                        }
                    }
                    //reloadFollowings();                   
                })
                .catch(err => handleError(`Here ${err}`));
        }
        setOpen(false);
    }

    return (
        <>
            <Dialog open={open} >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>  Follow User  </DialogTitle>
                <Divider />

                <DialogContent sx={{ width: 350, height: 180, pb: 0 }}>
                    <Box>
                        <Avatar
                            alt="avatar"
                            sx={{ width: '48px', height: '48px' }}
                            src={
                                post.user.avatar ? buildImageUrl(post.user.avatar) : ''
                            }>
                            {!post.user.avatar ? `${post.user.first_name.charAt(0)} ${post.user.last_name.charAt(0)}` : ''}
                        </Avatar>

                        <Typography varianr='h5' sx={{ mt: 1 }} gutterBottom>{nick}</Typography>

                        <TextField label='About me' inputProps={{ readOnly: true, style: { height: '100%' } }} multiline value={post.user.about_me ? post.user.about_me : ' '} sx={{ width: '100%', mt: 1 }} />

                    </Box>

                </DialogContent>

                <DialogActions>

                    {isFollowing === undefined && <Button onClick={setFollow} >Follow</Button>}
                    {isFollowing === true && <Button onClick={setFollow}>Unfollow</Button>}
                    {isFollowing === false && <Button onClick={setFollow} disabled >Pending</Button>}

                    <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogActions>

            </Dialog>

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackBarOpen(false)}
                message={snackBarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackBarOpen(false)} severity="info" sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
export default UserDetailsDialog;