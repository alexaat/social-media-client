import { Paper, Stack, Typography } from "@mui/material"
import GuestUserInfoCard from "./GuestUserInfoCard";

const GuestGroupInfo = ({ group }) => {

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
                            <GuestUserInfoCard user={group.creator} />
                            <Typography sx={{ mt: 1}}>Members</Typography>
                            {
                                !group.members ?
                                    <Typography>No Members</Typography> :
                                    group.members.length === 0 ?
                                        <Typography>No Members</Typography> :
                                        <Stack sx={{ height: '350px', border: '1px solid #eeeeee', padding: '4px', }} spacing={1}>
                                            {group.members.map(member => <GuestUserInfoCard key={member.id} user={member} />)}
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

export default GuestGroupInfo;