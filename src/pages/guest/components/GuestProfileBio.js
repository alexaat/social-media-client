import { Paper, Stack, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { ProvideUser } from "../../../context/UserContext";
//import EditBioDialog from "../../../dialogs/EditBioDialog";
import {  useState } from "react";
import { ProvideGuestData } from "./GuestDataContext";
import GuestEditBioDialog from "./GuestEditBioDialog";

// const GuestProfileBio = ({ownProfile}) => {
const GuestProfileBio = ({person_id}) => {
    //const [user, reloadUser] = ProvideUser();

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();


   // const person = person_id ? users.find(u => u.id == person_id) : user

    let person = user;
    if(person_id) {
        const p =  users.find(u => u.id == person_id);
        if(p.privacy === 'private'){
            p.email = '';
            p.first_name = '';
            p.last_name = '';
        }
        person = p;
    }


    const [openEditDetailsDialog, setOpenEditDetailsDialog] = useState(false);
    const onCloseDialog = () => setOpenEditDetailsDialog(false);
    const editBioClickHandler = () => setOpenEditDetailsDialog(true);   





    return (
        <>       
        <Paper elevation={2} sx={{ p: 1 }}>
            {person && <Stack spacing={2} >
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ borderBottom: '1px solid #ddd' }}>
                    <Typography variant='h5'>Bio</Typography>
                    
                    {
                        !person_id && 
                        <IconButton onClick={editBioClickHandler}>
                            <EditIcon />
                        </IconButton>
                    }

                </Stack>
                <TextField
                    label='nick name'
                    value={person.display_name}
                    InputProps={{
                        readOnly: true,
                        style: { color: '#A1A1A1' }
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled
                />

                <TextField
                    label='first name'
                    value={person.first_name}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled />

                <TextField
                    label='last name'
                    value={person.last_name}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled />

                <TextField
                    label='email'
                    value={person.email}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled />

                <TextField
                    label='about me'
                    value={person.about_me}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    multiline
                    rows={3}
                    variant="outlined"
                    focused={false}
                    disabled />
            </Stack>}

        </Paper>        

        <GuestEditBioDialog open={openEditDetailsDialog} onClose={onCloseDialog}/>
        
        </>


    );
}

export default GuestProfileBio;