import { Paper, Stack, Typography } from "@mui/material"
import UserInfoCard from "./UserInfoCard";

const GroupInfo = ({ group }) => {

    return (
        <Paper>
            <Stack sx={{ p: 1 }} >
                <Typography variant='h6' sx={{ mb: 1 }}>About group</Typography>

                {
                    group && !Array.isArray(group) ?
                        <>
                            <Typography>Title</Typography>
                            <Typography sx={{ mb: 1 }}>{group.title}</Typography>
                            <Typography>Description</Typography>
                            <Typography sx={{ mb: 1 }}>{group.description}</Typography>
                            <Typography>Creator</Typography>
                            <UserInfoCard user={group.creator} />
                            <Typography sx={{ mt: 1}}>Members</Typography>
                            {
                                !group.members ?
                                    <Typography>No Members</Typography> :
                                    group.members.length === 0 ?
                                        <Typography>No Members</Typography> :
                                        <Stack sx={{ height: '350px', border: '1px solid #eeeeee', padding: '4px', }} spacing={1}>
                                            {group.members.map(member => <UserInfoCard key={member.id} user={member} />)}
                                        </Stack>

                            }
                        </>
                        :
                        <></>
                }




            </Stack>
        </Paper>
    );
}

export default GroupInfo;