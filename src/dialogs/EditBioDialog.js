import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Button, IconButton, TextField } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ProvideUser }  from '../context/UserContext';
import {  useState } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { useNavigate } from "react-router-dom";
import { serverHost } from '../constants';


const EditBioDialog = ({open, onClose}) => {

    const navigate = useNavigate();

    const [user] = ProvideUser();

    const [userDetails, setUserDetails] = useState();

    const closeHandler = () => {
        onClose();
    }

    const submitHandler = () => {
        console.log('save...', userDetails);      
        onClose();
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
                    user: JSON.stringify(userDetails)
                })

            })
            .then(resp => resp.json())
            .then(data => {             
                if (data.error) {
                    throw new Error(data.error.message);
                }
                setUserDetails(undefined);
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
                    onChange={e => setUserDetails({...user, nick_name: e.target.value})}                  
                />

                <TextField
                    label='first name'
                    defaultValue={user.first_name}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...user, first_name: e.target.value})}     
                    />

                <TextField
                    label='last name'
                    defaultValue={user.last_name}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...user, last_name: e.target.value})}     
                    />

                <TextField
                    label='email'
                    defaultValue={user.email}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    onChange={e => setUserDetails({...user, email: e.target.value})}       
                    />

                <TextField
                    label='about me'
                    defaultValue={user.about_me}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    rows={3}
                    variant="outlined"
                    onChange={e => setUserDetails({...user, about_me: e.target.value})}     
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