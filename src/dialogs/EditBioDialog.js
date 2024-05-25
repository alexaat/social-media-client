import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Button, IconButton, TextField } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ProvideUser }  from '../context/UserContext';
import {  useState } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { useNavigate } from "react-router-dom";
import {
     serverHost,
     INVALID_NICK_NAME_FORMAT,
     INVALID_FIRST_NAME_FORMAT,
     INVALID_LAST_NAME_FORMAT,
     INVALID_EMAIL,
     INVALID_ABOUT_ME } from '../constants';


const EditBioDialog = ({open, onClose, reloadUser}) => {

    const navigate = useNavigate();

    const [user] = ProvideUser();

    const [userDetails, setUserDetails] = useState();

    const [nickNameError, setNickNameError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [aboutMeError, setAboutMeError] = useState('');

    const clearErrors = () => {
        setNickNameError('');
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setAboutMeError('');
    }

    const closeHandler = () => {
        clearErrors();
        onClose();
    }

    const submitHandler = () => { 
        clearErrors();   
       
       
       

        if(userDetails) {
            const session_id = getCookie(SESSION_ID);
            if(!session_id){
                navigate('/signin')
            }
                        
            fetch(serverHost + '/user?' + new URLSearchParams({ session_id }),
            {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json'
                },
                body: new URLSearchParams({
                  ...userDetails
                })

            })
            .then(resp => resp.json())
            .then(data => {             
                if (data.error) {
                    switch (data.error.type){
                        case INVALID_NICK_NAME_FORMAT:
                            setNickNameError(data.error.type);
                        break;

                        case INVALID_FIRST_NAME_FORMAT:
                            setFirstNameError(data.error.type);
                        break;

                        case INVALID_LAST_NAME_FORMAT:
                            setLastNameError(data.error.type);
                        break;

                        case INVALID_EMAIL:
                            setEmailError(data.error.type);
                        break;

                        case INVALID_ABOUT_ME:
                            setAboutMeError(data.error.type);
                        break;

                        default:
                            throw new Error(data.error.message);
                    }                   
                }

                setUserDetails(undefined);
                
                if(data.payload){
                    onClose(); 
                    console.log('reload user ...')    
                    reloadUser();
                }
                

            })
            .catch(err => {
                alert(err);
                setUserDetails(undefined);
            });
        }
      
    }

    return ( 
        <Dialog
            open={open}
            PaperProps={{
                sx: {
                    minWidth: '400px', p: 0, m: 0
                }
        }}>

            <DialogTitle>               
                <Stack direction='row' justifyContent='space-between'>
                <Typography variant="h6">Edit details</Typography>
                    <IconButton
                        sx={{ p: 0, m: 0 }}
                        aria-label="close edit details button"
                        onClick={closeHandler}
                    >
                    <CloseRoundedIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent>
            {user && 
                <Stack
                  spacing={2}
                  sx={{pt: 1}}  
                >
                <TextField
                    label='nick name'
                    defaultValue={user.nick_name}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...userDetails, nick_name: e.target.value})}
                    error = {Boolean(nickNameError)}  
                    helperText = {nickNameError}                
                />

                <TextField
                    label='first name'
                    defaultValue={user.first_name}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...userDetails, first_name: e.target.value})} 
                    error = {Boolean(firstNameError)}  
                    helperText = {firstNameError}      
                    />

                <TextField
                    label='last name'
                    defaultValue={user.last_name}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...userDetails, last_name: e.target.value})}
                    error = {Boolean(lastNameError)}  
                    helperText = {lastNameError}          
                    />

                <TextField
                    label='email'
                    defaultValue={user.email}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...userDetails, email: e.target.value})}    
                    error = {Boolean(emailError)}  
                    helperText = {emailError}        
                    />

                <TextField
                    label='about me'
                    defaultValue={user.about_me}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    rows={3}
                    variant="outlined"
                    onChange={e => setUserDetails({...userDetails, about_me: e.target.value})}   
                    error = {Boolean(aboutMeError)}  
                    helperText = {aboutMeError}       
                    />
            </Stack>}


            </DialogContent>

            <DialogActions>
                <Stack sx={{ px: 2, mb: 1, mt: -2 }} alignItems='end'>
                    <Button sx={{ width: '90px' }} variant="contained" onClick={submitHandler}>Save</Button>
                </Stack>
            </DialogActions>

        </Dialog>
     );
}
 
export default EditBioDialog;