import { Paper, Stack, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { ProvideUser } from "../../../context/UserContext";
import EditBioDialog from "../../../dialogs/EditBioDialog";
import {  useState } from "react";

const ProfileBio = ({ownProfile}) => {
    const [user, reloadUser] = ProvideUser();

    const [openEditDetailsDialog, setOpenEditDetailsDialog] = useState(false);
    const onCloseDialog = () => setOpenEditDetailsDialog(false);    

    const editBioClickHandler = () => setOpenEditDetailsDialog(true);   

    return (
        <>       
        <Paper elevation={2} sx={{ p: 1 }}>
            {user && <Stack spacing={2} >
                <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ borderBottom: '1px solid #ddd' }}>
                    <Typography variant='h5'>Bio</Typography>
                    
                    {
                        ownProfile && 
                        <IconButton
                        onClick={editBioClickHandler}
                        >
                        <EditIcon />
                        </IconButton>
                    }

                </Stack>
                <TextField
                    label='nick name'
                    value={user.nick_name}
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
                    value={user.first_name}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled />

                <TextField
                    label='last name'
                    value={user.last_name}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled />

                <TextField
                    label='email'
                    value={user.email}
                    InputProps={{
                        readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    focused={false}
                    disabled />

                <TextField
                    label='about me'
                    value={user.about_me}
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

        <EditBioDialog open={openEditDetailsDialog} onClose={onCloseDialog} reloadUser={reloadUser}/>
        
        </>


    );
}

export default ProfileBio;