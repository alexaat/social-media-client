import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography, Button, IconButton } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from "react";
import { ProvideUser } from "../context/UserContext";
import { handleError } from "../errors";
import { serverHost } from "../constants";
import { getCookie, SESSION_ID } from '../cookies';
import { useNavigate } from "react-router-dom";
import UserInfoCard from '../pages/group/components/UserInfoCard';

const GroupInviteDialog = ({ group, open, onClose, onSubmit }) => {

    const navigate = useNavigate();

    const [selectedUsers, setSelectetUsers] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        //Getting users
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate("/signin");
            return;
        }
        const url = `${serverHost}/users?${new URLSearchParams({ session_id })}`

        fetch(url,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {
                    const allUsers = data.payload;

                    //Filter those users that are already in the list and already invited
                    if (group && !Array.isArray(group)) {
                        const filtered = allUsers.filter(u => {
                            if (u.id === group.creator.id) {
                                return false;
                            }
                            if (group.members) {
                                for (let i = 0; i < group.members.length; i++) {
                                    const m = group.members[i];
                                    if (m.id === u.id) {
                                        return false;
                                    }
                                }
                            }

                            if (group.invited) {
                                const invites = group.invited;
                                if (Array.isArray(invites)) {
                                    for (let i = 0; i < invites.length; i++) {
                                        if (invites[i] === u.id) {
                                            return false;
                                        }
                                    }
                                }
                            }

                            return true;
                        });
                        setUsers(filtered);
                    }
                }
            })
            .catch(err => {
                console.log(err)
                handleError(err)
            });
    }, [open]);

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
                        users.map(user => {
                            return <Stack key={user.id}>
                                <UserInfoCard user={user} setSelectetUsers={setSelectetUsers} />
                            </Stack>

                        })
                    }
                </Stack>

            </DialogContent>

            <DialogActions>
                <Stack sx={{ px: 2, mb: 1, mt: -2 }} alignItems='end'>
                    <Button sx={{ width: '90px' }} variant="contained" onClick={submitHandler}>Invite</Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

export default GroupInviteDialog;