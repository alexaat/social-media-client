import { Card, CardContent, Typography, Stack, IconButton } from "@mui/material";
import Icon from "../../../components/Icon";
import { dateConverter } from "../../../util";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../../../context/UserContext";
import GuestIcon from '../components/GuestIcon';

const GuestFollowerCard = ({ user, date }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/guest/profile/${user.id}`)       
    }

   // console.log('user: ', user)


    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
                <Stack direction='row' spacing={2}>
                    <IconButton sx={{ p: 0 }} onClick={handleClick}>
                        {/* <UserProvider person_id={user.id}>
                            <Icon />
                        </UserProvider> */}
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