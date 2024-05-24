import { useEffect, useState } from "react";
import { INVALID_USER_FORMAT, NO_USER_FOUND, serverHost } from "../../constants";
import { SESSION_ID, setCookie } from '../../cookies';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Divider, Stack, TextField, Card, CardContent, CardMedia, Skeleton } from '@mui/material';
import { handleError } from "../../errors";
import { ProvideUser } from "../../context/UserContext";

const SignIn = () => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userError, setUserError] = useState('');
    const [signInError, setSignInError] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [img, setImg] = useState({});

    //Navigation
    const navigate = useNavigate();

    const clearErrors = () => {
        setUserError('');
        setSignInError('');
    }

    const [user, reloadUser] = ProvideUser();

    const signInHandler = () => {

        clearErrors();

        let headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        fetch(serverHost + '/signin', {
            method: 'POST',
            headers: headers,
            body: new URLSearchParams({
                user: userName, password
            })
        })
            .then(resp => resp.json())
            .then(data => {

                if (data.error) {

                    switch (data.error.type) {
                        case INVALID_USER_FORMAT:
                            setUserError(data.error.message);

                            break;
                        case NO_USER_FOUND:
                            setSignInError(data.error.message);
                            break;
                        default:
                            handleError(data.error);
                    }
                }
                if (data.payload) {

                    const session_id = data.payload.session_id;

                    if (session_id) {
                        setCookie(SESSION_ID, session_id, 1);
                        navigate("/");
                        reloadUser();

                    } else {
                        throw new Error('Could not obtain session id');
                    }
                }
            })
            .catch(err => handleError(err));
    }

    useEffect(() => {
        const image = new Image();
        image.onload = () => setImageLoaded(true);
        image.src = "https://source.unsplash.com/random";
        setImg(image);
    }, []);


    return (
        <>
            <Card sx={{ width: 350, backgroundColor: 'white', position: 'absolute', top: '10%', right: '15%' }}>

                {
                    imageLoaded ?
                        <CardMedia
                            height="140px"
                            component="img"
                            src='https://source.unsplash.com/random'
                            alt="sign in image"
                        />
                        :
                        <Skeleton variant="rectangular" height={140} />
                }

                <CardContent sx={{ p: 2 }}>
                    <Stack direction="column" spacing={2}>
                        <TextField label="Username or Email" onChange={e => setUserName(e.target.value)} value={userName} required error={userError !== ''} helperText={userError} />
                        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" required error={signInError !== ''} helperText={signInError} />
                        <Button variant="contained" onClick={signInHandler} size="large">Sign In</Button>
                        <Divider />
                        <Box sx={{ display: "flex", justifyContent: "center" }} >
                            <Button variant="contained" size="medium" color="success" onClick={() => navigate('/signup')}>Create New Account</Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}

export default SignIn;