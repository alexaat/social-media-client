import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Button, IconButton, TextField } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {  useState } from "react";
import { ProvideGuestData } from "./GuestDataContext";
import { validateEmail } from "../../../util";


const GuestEditBioDialog = ({open, onClose}) => {

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();
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
        

        if(userDetails.display_name !== undefined && (userDetails.display_name.length < 2 || userDetails.display_name.length > 50)){
            setNickNameError('Error: nick name must be between 2 and 50 characters long');
            return;
        }
        if(userDetails.first_name !== undefined && (userDetails.first_name.length < 2 || userDetails.first_name.length > 50)){
            setFirstNameError('Error: first name must be between 2 and 50 characters long')
        }
        if(userDetails.last_name !== undefined && (userDetails.last_name.length < 2 || userDetails.last_name.length > 50)){
            setLastNameError('Error: last name must be between 2 and 50 characters long');
            return;
        }
        if(userDetails.email !== undefined){
            if(!validateEmail(userDetails.email)){
                setEmailError('Error: invalid email');
                return;
            }           
        }
        if(userDetails.about_me !== undefined && userDetails.about_me.length > 1000){
            setAboutMeError('Error: about me must be less than 1000 characters long');
            return;
        }


        if(userDetails){
            const u = user;
            for (const [key, value] of Object.entries(userDetails)) {
                u[key] = value
            }
            setUser(u);
            onClose();
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
                    defaultValue={user.display_name}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...userDetails, display_name: e.target.value})}
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
 
export default GuestEditBioDialog;