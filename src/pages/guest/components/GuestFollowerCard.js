import { Card, CardContent, Typography, Stack, IconButton } from "@mui/material";
import { dateConverter } from "../../../util";
import { useNavigate } from "react-router-dom";
import GuestIcon from '../components/GuestIcon';

const GuestFollowerCard = ({ user, date }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/guest/profile/${user.id}`)       
    }

    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
                <Stack direction='row' spacing={2}>
                    <IconButton sx={{ p: 0 }} onClick={handleClick}>
                        <GuestIcon user={user}/>
                    </IconButton>
                    <Stack>
                        <Typography>{user.display_name}</Typography>
                        <Typography>Following for: {dateConverter(date).slice(0, -4)}</Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default GuestFollowerCard;