import { Button, Snackbar, Alert } from "@mui/material";
import { ProvideFollowings } from "../../../context/FollowingsContext";
import { AUTHORIZATION, serverHost } from "../../../constants";
import { getCookie, SESSION_ID } from "../../../cookies";
import { useNavigate } from 'react-router-dom';
import { handleError } from "../../../errors";
import { useState } from "react";

const FollowToggle = ({ person_id }) => {

    const [followings, reloadFollowings] = ProvideFollowings();

    let isFollowing = undefined;

    //Navigation
    const navigate = useNavigate();

    //SnackBar
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    let text = 'Follow';
    let variant = 'contained';

    if (person_id && followings && followings.length > 0) {

        const following = followings.filter(item => item.following.id == person_id)
        if (following.length > 0) {
            variant = 'outlined';
            if (following[0].approved) {
                isFollowing = true;
                text = 'Unfollow';
            } else {
                isFollowing = false;
                text = 'Pending';
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
            fetch(serverHost + '/following?' + new URLSearchParams({ session_id, follow: person_id }),
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
                    reloadFollowings();
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
                        follow: person_id
                    })
                })
                .then(resp => resp.json())
                .then(data => {

                    if (data.error) {
                        if (data.error.type === AUTHORIZATION) {
                            setSnackBarMessage(data.error.message);
                            if (data.error.message.toLowerCase().trim().includes('error')) {
                                setSeverity('error')
                            }
                            setSnackBarOpen(true);
                        } else {
                            throw new Error(data.error);
                        }
                    }
                })
                .catch(err => handleError(`Here ${err}`));
        }
    }

    return (
        <>
            {person_id &&
                <Button variant={variant} onClick={setFollow} disabled={isFollowing === false}>{text}</Button>
            }

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackBarOpen(false)}
                message={snackBarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackBarOpen(false)} severity={severity} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default FollowToggle;