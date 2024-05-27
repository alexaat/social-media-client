import { Stack, Box, Skeleton, Grid, Tab, Tabs, Button } from "@mui/material";
import { ProvideGroups } from "../../../context/GroupsContext";
import { useEffect, useState } from "react";
import GroupInfo from "./GroupInfo";
import NewPostButton from '../../../components/NewPostButton';
import NewPostDialog from "../../../dialogs/NewPostDialog";
import { PostsProvider } from "../../../context/PostsContext";
import GroupPosts from "../../../components/GroupPosts";
import { SESSION_ID, getCookie } from '../../../cookies';
import { ACCEPT_JOIN_GROUP_INVITE, AUTHORIZATION, DECLINE_JOIN_GROUP_INVITE, INVITATION_TO_JOIN_GROUP, LEAVE_GROUP, NEW_EVENT_NOTIFICATION, REQUEST_TO_JOIN_GROUP, REQUEST_TO_JOIN_GROUP_APPROVED, REQUEST_TO_JOIN_GROUP_DECLINED, serverHost } from "../../../constants";
import { handleError } from "../../../errors";
import { ProvideUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import GroupInviteDialog from "../../../dialogs/GroupInviteDialog";
import NewMemberRequestsApproveDialog from "../../../dialogs/NewMemberRequestsApproveDialog";
import { ProvideGroupInvites } from "../../../context/GroupInvitesContext";
import { ProvideWebSocket } from "../../../context/WebSocketContext";
import { ProvideJoinRequests } from "../../../context/JoinRequestsProvider";
import GroupEvents from "../../../components/GroupEvents";
import { ProvideNotifications } from "../../../context/NotificationsContext";
import { ProvideEvents } from "../../../context/EventsContext";
import { imageURL } from "../../../constants";
import defaultBackground from '../../../assets/long_background_image.jpg'

const Page = ({ group_id }) => {

    const [tab, setTab] = useState(0);
    const [notifications, reloadNotifications] = ProvideNotifications();
    const [events, reloadEvents] = ProvideEvents();

    const [src, setSrc] = useState(imageURL);

    //Comments
    const submitCommentHandler = (postId, content) => {

        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        const url = `${serverHost}/comments?` + new URLSearchParams({ post_id: postId, content, session_id });
        fetch(url, {
            method: "POST",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('comment data ', data)
                if (data.error) {
                    throw new Error(data.error)
                }
                if (data.payload) {
                    setReload(Math.random());
                }
            })
            .catch(err => {
                handleError(err)
            });

    }

    const [reload, setReload] = useState(1);
    const [groups, reloadGroups] = ProvideGroups();
    const [groupInvites, reloadInvites] = ProvideGroupInvites();
    const [joinRequests, reloadJoinRequests, joinRequestError] = ProvideJoinRequests();

    if (joinRequestError) {
        handleError(joinRequestError);
    }

    const [socket, wsError] = ProvideWebSocket();
    if (socket) {
        socket.onmessage = message => {
            const m = JSON.parse(message.data);           
            if (m.type === ACCEPT_JOIN_GROUP_INVITE ||
                m.type === LEAVE_GROUP ||
                m.type === REQUEST_TO_JOIN_GROUP_DECLINED ||
                m.type === REQUEST_TO_JOIN_GROUP_APPROVED ||
                m.type === DECLINE_JOIN_GROUP_INVITE) {
                reloadGroups();
                reloadEvents();
                setReload(Math.random());            
            }
            if (m.type === INVITATION_TO_JOIN_GROUP) {
                reloadNotifications();
                reloadInvites();

            }
            if (m.type === REQUEST_TO_JOIN_GROUP) {
                reloadNotifications();
                reloadJoinRequests();
            }
            if (m.type === NEW_EVENT_NOTIFICATION) {
                reloadEvents();
                reloadNotifications();

            }
        }
        socket.onerror = error => console.log('Error: ', error)

    }
    if (wsError) {
        console.log('error: ', wsError)
    }

    const navigate = useNavigate();

    const [image, setImage] = useState();
    const [user] = ProvideUser();


    const [openNewPostDialog, setOpenNewPostDialog] = useState(false);
    const newPostDialogCloseHandler = () => {
        setOpenNewPostDialog(false);
    }

    const deleteGroupListener = () => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        const url = serverHost + `/groups/${group_id}?` + new URLSearchParams({ session_id })
        fetch(
            url,
            {
                method: "DELETE",
                headers: { 'Accept': 'application/json' }
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    if (data.error.type === AUTHORIZATION) {
                        handleError(data.error.message)
                    } else {
                        throw new Error(data.error)
                    }
                }
                if (data.payload) {
                    navigate('/');
                }

            })
            .catch(err => handleError(err));
    }

    const leaveGroupListener = () => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        const url = `${serverHost}/groups/${group_id}?` + new URLSearchParams({ action: 'leave', session_id });

        fetch(url, {
            method: "PATCH",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('leave group data ', data)
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {
                    reloadEvents();
                    reloadGroups();
                    setReload(Math.random());
                }
            })
            .catch(err => {
                handleError(err)
            });

    }

    const joinGroupListener = () => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        const url = `${serverHost}/groups/${group_id}?` + new URLSearchParams({ action: 'join', session_id });
        fetch(url, {
            method: "PATCH",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {
                    reloadGroups();
                }
            })
            .catch(err => {
                handleError(err)
            });
    }

    const acceptInviteGroupListener = () => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        let group_id = undefined
        if (groups && !Array.isArray(groups)) {
            group_id = groups.id
        }
        if (!group_id) {
            return
        }

        const url = `${serverHost}/groups/invites?` + new URLSearchParams({ action: 'accept', group_id, session_id });
        fetch(url, {
            method: "PATCH",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('accept invite data ', data)
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {               
                    reloadGroups();
                    setReload(Math.random());
                    reloadInvites();
                    reloadEvents();
                }
            })
            .catch(err => {
                handleError(err)
            });
    }

    const declineInviteGroupListener = () => {

        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        let group_id = undefined
        if (groups && !Array.isArray(groups)) {
            group_id = groups.id
        }
        if (!group_id) {
            return
        }

        const url = `${serverHost}/groups/invites?` + new URLSearchParams({ action: 'decline', group_id, session_id });
        fetch(url, {
            method: "PATCH",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('decline data ', data)
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {
                    reloadInvites();
                }
            })
            .catch(err => {
                handleError(err)
            });
    }

    const [groupInviteDialogOpen, setGroupInviteDialogOpen] = useState(false);
    const closeGroupInviteDialogHandler = () => setGroupInviteDialogOpen(false);
    const submitGroupIviteDialogHandler = selectedUsers => {
        closeGroupInviteDialogHandler();

        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }

        selectedUsers.forEach(member => {
            const url = `${serverHost}/groups/${group_id}?` + new URLSearchParams({ action: 'invite', member, session_id });
            fetch(url, {
                method: "PATCH",
                headers: { 'Accept': 'application/json' }
            })
                .then(resp => resp.json())
                .then(data => {
                    //console.log('data ', data)
                    if (data.error) {
                        throw new Error(data.error.message)
                    }
                    if (data.payload) {
                        reloadGroups();
                    }
                })
                .catch(err => {
                    handleError(err)
                });
        })

    }
    const inviteToGroupListener = () => {
        setGroupInviteDialogOpen(true);
    }

    const groupTitle = groups && !Array.isArray(groups) ? groups.title : undefined;

    let groupButtonDeleteText = '';
    let groupButtonLeaveGroup = '';
    let groupButtonJoinGroup = '';
    let groupButtonInvite = '';
    let groupButtonAcceptInvite = '';
    let groupButtonAwaitingJoinApprovalGroup = '';

    if (groups && !Array.isArray(groups) && user) {
        if (groups.creator.id === user.id) {         
            groupButtonDeleteText = 'Delete Group';
            groupButtonInvite = 'Invite';
        } else {
            if (groups.awaiting_join_approval) {
                groupButtonAwaitingJoinApprovalGroup = 'Pending Approval'
            }
            if(groupInvites) {
                groupInvites.forEach(invite => {
                    if (invite.group.id === groups.id) {
                        groupButtonAcceptInvite = 'Accept invitation'
                    }
                })
            }
            if (groups.members.length > 0 && !groupButtonAcceptInvite) {
                const member = groups.members.filter(m => m.id === user.id);
                if (member && member.length > 0) {
                    groupButtonLeaveGroup = 'Leave Group';
                    groupButtonInvite = 'Invite';
                } else {
                    groupButtonJoinGroup = 'Join';
                }
            } else {              
                if (groupInvites) {                   
                    groupInvites.forEach(invite => {
                        if (invite.group.id === groups.id) {
                            groupButtonAcceptInvite = 'Accept invitation'
                        }
                    })
                }
                if (!groupButtonAcceptInvite) {
                    groupButtonJoinGroup = 'Join';
                }
            }
        }
    }

    const newPostClickHandler = () => {
        setOpenNewPostDialog(true);
    }

    const postSubmitHandler = (content, image) => {
        const formData = new FormData();
        if (image) {
            formData.append('image', image);
        }
        formData.append('content', content);
        formData.append('group_id', group_id);
        const session_id = getCookie(SESSION_ID);
        const postUrl = `${serverHost}/posts?` + new URLSearchParams({ session_id });
        let headers = new Headers();
        headers.append('Accept', 'application/json');

        fetch(postUrl,
            {
                method: 'POST',
                body: formData,
                headers: headers
            })
            .then(resp => resp.json())
            .then(data => {
                console.log('Post Submit Response: ', data)
                if (data.error) {
                    throw new Error(data.error)
                }
                if (data.payload) {
                    setReload(Math.random());
                }
            })
            .catch(err => handleError(err));
        newPostDialogCloseHandler();
    }

    const [newMemberRequestsApproveDialogOpen, setNewMemberRequestsApproveDialogOpen] = useState(false);
    const approveMember = (user_id, group_id) => {
        newMemberRequestsApproveDialogCloseHandler()
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        const url = `${serverHost}/groups/requests/${group_id}?` + new URLSearchParams({ action: 'approve', member_id: user_id, session_id });

        fetch(url, {
            method: "PATCH",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {
                    reloadGroups();
                    reloadJoinRequests();
                }
            })
            .catch(err => {
                handleError(err)
            });
    }
    const declineMember = (user_id, group_id) => {
        newMemberRequestsApproveDialogCloseHandler()
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate('/signin');
            return;
        }
        const url = `${serverHost}/groups/requests/${group_id}?` + new URLSearchParams({ action: 'decline', member_id: user_id, session_id });

        fetch(url, {
            method: "PATCH",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                console.log('approve group data ', data)
                if (data.error) {
                    throw new Error(data.error.message)
                }
                if (data.payload) {
                    reloadJoinRequests();
                }
            })
            .catch(err => {
                handleError(err)
            });
    }
    const newMemberRequestsButtonClickHandler = () => {
        setNewMemberRequestsApproveDialogOpen(true);
    }
    const newMemberRequestsApproveDialogCloseHandler = () => {
        setNewMemberRequestsApproveDialogOpen(false)
    }

    useEffect(() => {
        const image = new Image();
       

        if(groups.image){
            image.src = groups.image
        } else {
            image.src =  "https://source.unsplash.com/random";
            image.onload = () => setImage(image);
            image.onerror = () =>{
                setSrc(defaultBackground);
                setImage(true);
            }
        }       
        
        reloadGroups();


    }, [group_id]);

    return (

        <Grid container justifyContent='center'>
            <Grid item xs={12} md={10}>
                {/* Top Image */}
                {
                    image ?
                        <Box
                            height="140px"
                            width='100%'
                            component="img"
                            src={src}
                            alt="image on profile page"
                            sx={{ objectFit: 'cover' }}
                        />
                        :
                        <Skeleton variant="rectangular" height="140px" width='100%' />
                }
                <Stack spacing={2} direction='row' alignItems='center' sx={{ mb: 1, px: { xs: 1, md: 0 } }} justifyContent='end'>
                    {joinRequests && joinRequests.length > 0 && <Button variant='contained' onClick={newMemberRequestsButtonClickHandler}>New Member Requests: {joinRequests.length}</Button>}
                    {groupButtonInvite && <Button variant='contained' onClick={inviteToGroupListener}>{groupButtonInvite}</Button>}
                    {groupButtonAcceptInvite && <Button variant='contained' onClick={acceptInviteGroupListener}>{groupButtonAcceptInvite}</Button>}
                    {groupButtonAcceptInvite && <Button variant='outlined' onClick={declineInviteGroupListener}>Decline Invitation</Button>}
                    {groupButtonJoinGroup && !groupButtonAwaitingJoinApprovalGroup && <Button variant='contained' onClick={joinGroupListener}>{groupButtonJoinGroup}</Button>}
                    {groupButtonAwaitingJoinApprovalGroup && <Button variant='contained' disabled >{groupButtonAwaitingJoinApprovalGroup}</Button>}
                    {groupButtonLeaveGroup && <Button variant='outlined' onClick={leaveGroupListener}>{groupButtonLeaveGroup}</Button>}
                    {groupButtonDeleteText && <Button variant='outlined' onClick={deleteGroupListener}>{groupButtonDeleteText}</Button>}
                </Stack>

                <Grid container sx={{ py: 0, px: { xs: 1, md: 0 } }} >

                    <Grid item xs={12} md={4}>
                        <GroupInfo group={groups} />
                    </Grid>

                    <Grid item xs={12} md={8} sx={{ pl: { xs: 0, md: 1 }, pt: { xs: 1, md: 0 } }}>
                        {user &&
                            groups &&
                            !Array.isArray(groups) &&
                            (groups.creator.id === user.id || (groups.members && Array.isArray(groups.members) && groups.members.filter(m => m.id === user.id).length > 0)) &&
                            <Stack sx={{ pb: 1 }}>
                                <NewPostButton sx={{ width: '100%' }} clickHandler={newPostClickHandler} />
                            </Stack>
                        }

                        <Tabs aria-label="post events tabs" value={tab} onChange={(event, newValue) => setTab(newValue)}>
                            <Tab label="Posts" />
                            <Tab label="Events" />
                        </Tabs>

                        {
                            tab === 0 && <PostsProvider group_id={group_id}>
                                <GroupPosts group_id={group_id} reload={reload} submitCommentHandler={submitCommentHandler} />
                            </PostsProvider>

                        }

                        {
                            tab === 1 && <GroupEvents/>
                        }

                    </Grid>
                </Grid>
            </Grid>
            <NewPostDialog
                open={openNewPostDialog}
                closeDialogHandler={newPostDialogCloseHandler}
                groupTitle={groupTitle}
                submitHandler={postSubmitHandler}
                groupId={groups && !Array.isArray(groups) ? groups.id : undefined} />
            <GroupInviteDialog group={groups} open={groupInviteDialogOpen} onClose={closeGroupInviteDialogHandler} onSubmit={submitGroupIviteDialogHandler} />
            <NewMemberRequestsApproveDialog
                open={newMemberRequestsApproveDialogOpen}
                onClose={newMemberRequestsApproveDialogCloseHandler}
                requests={joinRequests}
                approveMember={approveMember}
                declineMember={declineMember}
            />
        </Grid>

    );
}

export default Page;