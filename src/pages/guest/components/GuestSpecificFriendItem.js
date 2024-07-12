import { Stack, Typography, Checkbox, Paper } from "@mui/material";
import GuestIcon from "./GuestIcon";
import { dateConverter } from "../../../util";

const GuestSpecificFriendItem = ({ follower, isSelected, selectHandler, date }) => {

    return (
        <Paper sx={{ bgcolor: '#eee', mt: 1 }}>
            <Stack direction='row' sx={{ p: 1 }}>              
                <GuestIcon user={follower}/>
                <Stack sx={{ mx: 1, flexGrow: 1 }}>
                    <Typography variant="body1">{follower.display_name}</Typography>
                    <Typography variant="body2">Follower For: {dateConverter(date)}</Typography>
                </Stack>
                <Checkbox checked={isSelected} onChange={() => selectHandler(follower.id)} />
            </Stack>
        </Paper>
    );
}
export default GuestSpecificFriendItem;