import { Stack, Typography, Avatar, Paper, Checkbox, IconButton } from "@mui/material";
import { useState } from "react";
import GuestIcon from '../../components/GuestIcon';
import { useNavigate } from 'react-router-dom';


const GuestUserInfoCard = ({ user, setSelectetUsers }) => {

    //Navigation
    const navigate = useNavigate();

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

    const iconClickListener = (user) => {
        navigate('/guest/profile/'+user.id)
    }

    return (
        <Paper>
            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ m: 1 }}>
                <Stack direction='row' spacing={2} alignItems='center'>
                    <IconButton
                        aria-label="user icon"                       
                        onClick={() => iconClickListener(user)}
                        disableRipple
                        >
                        <GuestIcon user={user} sx={{ width: '38px', height: '38px'}}/>
                    </IconButton>

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