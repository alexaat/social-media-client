import { Stack, Typography, Avatar, Paper, Checkbox } from "@mui/material";
import { buildImageUrl } from '../../../../util';
import { useState } from "react";

const GuestUserInfoCard = ({ user, setSelectetUsers }) => {

    let initials = user.display_name.split(" ");
    if (initials.length > 1) {
        initials = initials[0].charAt(0) + " " + initials[1].charAt(0);
    } else if (initials.length == 1) {
        initials = initials[0].charAt(0)
    } else {
        initials = '';
    }

    const [checked, setChecked] = useState(false);
    const handleChange = () => {
        if(checked) {
            setSelectetUsers(prev => prev.filter(id => id !==user.id))
        }else{           
            setSelectetUsers(prev => [...prev.filter(id => id !==user.id), user.id])
        }      
        setChecked(prev => !prev);
    }


    return (
        <Paper>
            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ m: 1 }}>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <Avatar
                        alt="avatar"
                        sx={{ width: '38px', height: '38px' }}
                        src={
                            user.avatar ? user.avatar : ''
                        }>

                        {!user.avatar && initials}
                    </Avatar>

                    <Typography variant='body1' sx={{ fontWeight: 600 }}>{user.display_name}</Typography>
                </Stack>
                {
                    setSelectetUsers && <Checkbox checked={checked} onChange={handleChange} />
                }

            </Stack>
        </Paper>
    );
}

export default GuestUserInfoCard;