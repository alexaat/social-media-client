import { Card, CardContent, Typography, Stack, IconButton } from "@mui/material";
import Icon from "../../../components/Icon";
import { dateConverter } from "../../../util";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../../../context/UserContext";

const FollowerCard = ({ user, date }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profile/${user.id}`)       
    }

    return (
        <Card variant="outlined" sx={{ mb: 1 }}>
            <CardContent>
                <Stack direction='row' spacing={2}>
                    <IconButton sx={{ p: 0 }} onClick={handleClick}>
                        <UserProvider person_id={user.id}>
                            <Icon />
                        </UserProvider>
                    </IconButton>
                    <Stack>
                        <Typography>{user.first_name}</Typography>
                        <Typography>Following for: {dateConverter(date)}</Typography>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default FollowerCard;