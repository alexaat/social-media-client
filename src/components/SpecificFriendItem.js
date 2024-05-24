import { Stack, Typography, Checkbox, Paper } from "@mui/material";
import Icon from "./Icon";
import { dateConverter } from "../util";
import { UserProvider } from "../context/UserContext";


const SpecificFriendItem = ({ follower, isSelected, selectHandler }) => {

    const user = follower ? follower.follower : null;

    const nick = follower ? follower.follower.nick_name ? follower.follower.nick_name : follower.follower.first_name + ' ' + follower.follower.last_name : null;

    return (
        <Paper sx={{ bgcolor: '#eee', mt: 1 }}>
            <Stack direction='row' sx={{ p: 1 }}>

                <UserProvider person_id={user.id}>
                    <Icon />
                </UserProvider>


                <Stack sx={{ mx: 1, flexGrow: 1 }}>
                    <Typography variant="body1">{nick && nick}</Typography>
                    <Typography variant="body2">Follower For: {dateConverter(follower.date)} </Typography>
                </Stack>

                <Checkbox checked={isSelected} onChange={() => selectHandler(user.id)} />

            </Stack>
        </Paper>

    );
}

export default SpecificFriendItem;