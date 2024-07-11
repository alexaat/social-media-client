import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Button, IconButton } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from "react";
import GuestInfoCard from '../../components/GuestInfoCard';
import GuestUserInfoCard from './GuestUserInfoCard';
import { ProvideGuestData } from "../../components/GuestDataContext";

const GroupInviteDialog = ({ group, open, onClose, onSubmit }) => {

    const [     
        user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms,
        groups, setGroups,
        events, setEvents,
        joinGroupRequests, setJoinGroupRequests,
        joinGroupInvites, setJoinGroupInvites] = ProvideGuestData();
    

    const [selectedUsers, setSelectetUsers] = useState([]);

    const [filtered, setFiltered] = useState([]); 

    useEffect(() => {
        const _filtered = [];

        //Check that already in group or creator
        users.forEach(u => {
            //Check that already in group or creator
            if(group){
                const isMember = group.members.find(m => m.id === u.id) || group.creator.id === u.id;
                if(!isMember){
                    //Check that user made join request
                    const rerquest = joinGroupRequests.find(r => r.group.id === group.id && r.sender.id === u.id);
                    if(!rerquest){
                        //Check there are no invites been sent to user
                        const invite = joinGroupInvites.find(inv => inv.group.id === group.id && inv.recipient.id === u.id)
                        if(!invite){
                            _filtered.push(u);
                        }
                    }
                }                
            }
        });
        setFiltered(_filtered);
    },[open]);

    const closeHandler = () => {
        setSelectetUsers([]);
        onClose();
    }

    const submitHandler = () => {
        onSubmit(selectedUsers);
        setSelectetUsers([]);
    }

    return (
        <Dialog
            open={open}
            PaperProps={{
                sx: {
                    minWidth: '400px', p: 0, m: 0
                },
            }}>
            <DialogTitle>

                <Stack direction='row' justifyContent='space-between'>
                    <Typography variant="h6">Invite To Group</Typography>
                    <IconButton
                        sx={{ p: 0, m: 0 }}
                        aria-label="close invite dialog button"
                        onClick={closeHandler}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Stack>

            </DialogTitle>

            <DialogContent>

                <Stack spacing={0.5} sx={{ border: '1px solid #eeeeee', minHeight: '350px', p: 0.5 }}>
                    {
                        filtered.map(user => {
                            return <Stack key={user.id}>
                                <GuestUserInfoCard user={user} setSelectetUsers={setSelectetUsers} />
                            </Stack>

                        })
                    }
                    {
                        filtered.length === 0 && <GuestInfoCard title='Users' message='No users' color='#0000FF'/>
                    }
                </Stack>
            </DialogContent>

            <DialogActions>
                <Stack sx={{ px: 2, mb: 1, mt: -2 }} alignItems='end'>
                    <Button sx={{ width: '90px' }} variant="contained" disabled={filtered.length === 0} onClick={submitHandler}>Invite</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

export default GroupInviteDialog;