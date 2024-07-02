import { Stack, ToggleButtonGroup, ToggleButton } from "@mui/material";
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';


const GuestPrivacyToggle = ({ privacy, user, privacyChangeHandler }) => {
    return (
        <Stack direcrion='row' justifyContent='right' alignItems='center' sx={{ border: '2px solig green', width: '100%' }}>
            <ToggleButtonGroup
                value={privacy ? privacy : (user ? user.privacy : '')}
                exclusive
                onChange={privacyChangeHandler}>
                <ToggleButton value="public" aria-label="public">
                    <PublicRoundedIcon />
                </ToggleButton>
                <ToggleButton value="private" aria-label="private">
                    <PeopleAltRoundedIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Stack>

    );
}

export default GuestPrivacyToggle;