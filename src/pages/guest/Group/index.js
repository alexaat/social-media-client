import { Stack, Box, Skeleton, Grid, Tab, Tabs, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GuestGroupInfo from "./components/GuestGroupInfo";
import GuestNewPostButton from '../../guest/components/GuestNewPostButton';
import GuestNewPostDialog from "../components/GuestNewPostDialog";
// import { PostsProvider } from "../../../context/PostsContext";
import GuestGroupPosts from "./components/GuestGroupPosts";
// import { SESSION_ID, getCookie } from '../../../cookies';
// import { ACCEPT_JOIN_GROUP_INVITE, AUTHORIZATION, DECLINE_JOIN_GROUP_INVITE, INVITATION_TO_JOIN_GROUP, LEAVE_GROUP, NEW_EVENT_NOTIFICATION, REQUEST_TO_JOIN_GROUP, REQUEST_TO_JOIN_GROUP_APPROVED, REQUEST_TO_JOIN_GROUP_DECLINED, serverHost } from "../../../constants";
// import { handleError } from "../../../errors";
// import { ProvideUser } from "../../../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import GroupInviteDialog from "../../../dialogs/GroupInviteDialog";
import GuestNewMemberRequestsApproveDialog from "./components/GuestNewMemberRequestsApproveDialog";
// import { ProvideGroupInvites } from "../../../context/GroupInvitesContext";
// import { ProvideJoinRequests } from "../../../context/JoinRequestsProvider";
import GuestGroupEvents from "./components/GuestGroupEvents";
// import { ProvideNotifications } from "../../../context/NotificationsContext";
// import { ProvideEvents } from "../../../context/EventsContext";
import { imageURL } from "../../../constants";
import defaultBackground from '../../../assets/long_background_image.jpg'
import { ProvideGuestData } from "../components/GuestDataContext";
import { useNavigate } from 'react-router-dom';

const GroupGuest = () => {
    
    const navigate = useNavigate();

    const ButtonStates = {
        Join: 'Join',
        Pending: 'Pending',
        Leave: 'Leave',
        Delete: 'Delete'      
      };

    const [buttonsState, setButtonsState] = useState();

    const { group_id } = useParams(); 

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
        joinGroupRequests, setJoinGroupRequests] = ProvideGuestData();

    const [group, setGroup] = useState();

    const [tab, setTab] = useState(0);
    const [src, setSrc] = useState(imageURL);

    const [joinRequests, setJoinRequests] = useState([]);

    // //Comments
    const submitCommentHandler = (postId, content) => {
        console.log(postId);
        console.log(content);



        // const session_id = getCookie(SESSION_ID);
        // if (!session_id) {
        //     navigate('/signin');
        //     return;
        // }
        // const url = `${serverHost}/comments?` + new URLSearchParams({ post_id: postId, content, session_id });
        // fetch(url, {
        //     method: "POST",
        //     headers: { 'Accept': 'application/json' }
        // })
        //     .then(resp => resp.json())
        //     .then(data => {
        //         console.log('comment data ', data)
        //         if (data.error) {
        //             throw new Error(data.error)
        //         }
        //         if (data.payload) {
        //             setReload(Math.random());
        //         }
        //     })
        //     .catch(err => {
        //         handleError(err)
        //     });

    }

    const [image, setImage] = useState();
    
    const [openNewPostDialog, setOpenNewPostDialog] = useState(false);
    const newPostDialogCloseHandler = () => {
        setOpenNewPostDialog(false);
    }

    const deleteGroupListener = () => {

        //1. Remove group
        setGroups(prev => prev.filter(group => group.id != group_id));

        //2. Remove posts
        setPosts(prev => prev.filter(post => post.group_id != group_id));

        //3. Remove Events
        setEvents(prev => prev.filter(event => event.group_id != group_id));


        setNotifications(prev => {
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
            const sender = {
                id: group.id,
                display_name: group.title
            };
            const content = 'Group is deleted: ' + group.title;  
            const notification = {
                id,
                content,
                date:  Date.now(),
                sender,
                is_read: false
            }
                return [...prev, notification];
          });


        navigate('/guest');     
    }

     const leaveGroupListener = () => {
        setGroups(prev => {
            const group = prev.find(g => g.id == group_id);
            if(group){
                group.members = group.members.filter(m => m.id !== user.id);
                return [...prev.filter(g => g.id !== group.id), group];
            }
            return prev;
        });
        
        setNotifications(prev => {
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;             
            const content = 'Leaving group: ' + group.title;  
            const sender ={
                id: group.id,
                display_name: group.title
            };
            const notification = {
                id,
                content,
                date:  Date.now(),
                sender,
                is_read: false
            }
                return [...prev, notification];
          });
     }

    const joinGroupListener = () => {

        setJoinGroupRequests(prev => {            
            const filtered = prev.filter(item => !(item.group.id == group_id && item.sender.id === user.id));
            const id = filtered.length === 0 ? 1 : filtered.sort((a, b) => a.id<b.id ? 1: -1)[0].id + 1;
            const request = {
                id,
                sender: user,
                group,
                recipient: group.creator 
            }
            return [...filtered, request];
        });

        setNotifications(prev => {
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
            const sender = {
                id: group.id,
                display_name: group.title
            };
            const content = 'Join request was sent to ' + group.title;  
            const notification = {
                id,
                content,
                date:  Date.now(),
                sender,
                is_read: false
            }
                return [...prev, notification];
          });


        setTimeout(() => {

            setJoinGroupRequests(prev => prev.filter(item => !(item.group.id == group_id && item.sender.id === user.id)));

            setNotifications(prev => {
                const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;             
                const content = 'Join the group is approved: ' + group.title;  
                const sender ={
                    id: group.id,
                    display_name: group.title
                };
                const notification = {
                    id,
                    content,
                    date:  Date.now(),
                    sender,
                    is_read: false
                }
                    return [...prev, notification];
              });

            setGroups(prev => {
                const group = prev.find(g => g.id == group_id);
                if(group){
                    const member = group.members.find(m => m.id === user.id);
                    const isCreator = group.creator.id === user.id;
                    if(!member && !isCreator){
                        group.members.push(user);
                    }                    
                    return [...prev.filter(g => g.id !== group.id), group];
                }
                return prev;
            });       

        }, 1500);
    }

     const acceptInviteGroupListener = () => {
    //     const session_id = getCookie(SESSION_ID);
    //     if (!session_id) {
    //         navigate('/signin');
    //         return;
    //     }
    //     let group_id = undefined
    //     if (groups && !Array.isArray(groups)) {
    //         group_id = groups.id
    //     }
    //     if (!group_id) {
    //         return
    //    }

    //     const url = `${serverHost}/groups/invites?` + new URLSearchParams({ action: 'accept', group_id, session_id });
    //     fetch(url, {
    //         method: "PATCH",
    //         headers: { 'Accept': 'application/json' }
    //     })
    //         .then(resp => resp.json())
    //         .then(data => {
    //             console.log('accept invite data ', data)
    //             if (data.error) {
    //                 throw new Error(data.error.message)
    //             }
    //             if (data.payload) {               
    //                 reloadGroups();
    //                 setReload(Math.random());
    //                 reloadInvites();
    //                 reloadEvents();
    //             }
    //         })
    //         .catch(err => {
    //             handleError(err)
    //         });
     }

     const declineInviteGroupListener = () => {

    //     const session_id = getCookie(SESSION_ID);
    //     if (!session_id) {
    //         navigate('/signin');
    //         return;
    //     }
    //     let group_id = undefined
    //     if (groups && !Array.isArray(groups)) {
    //         group_id = groups.id
    //     }
    //     if (!group_id) {
    //         return
    //     }

    //     const url = `${serverHost}/groups/invites?` + new URLSearchParams({ action: 'decline', group_id, session_id });
    //     fetch(url, {
    //         method: "PATCH",
    //         headers: { 'Accept': 'application/json' }
    //     })
    //         .then(resp => resp.json())
    //         .then(data => {
    //             console.log('decline data ', data)
    //             if (data.error) {
    //                 throw new Error(data.error.message)
    //             }
    //             if (data.payload) {
    //                 reloadInvites();
    //             }
    //         })
    //         .catch(err => {
    //             handleError(err)
    //         });
     }

    // const [groupInviteDialogOpen, setGroupInviteDialogOpen] = useState(false);
    // const closeGroupInviteDialogHandler = () => setGroupInviteDialogOpen(false);
    
     const submitGroupIviteDialogHandler = selectedUsers => {
    //     closeGroupInviteDialogHandler();

    //     const session_id = getCookie(SESSION_ID);
    //     if (!session_id) {
    //         navigate('/signin');
    //         return;
    //     }

    //     selectedUsers.forEach(member => {
    //         const url = `${serverHost}/groups/${group_id}?` + new URLSearchParams({ action: 'invite', member, session_id });
    //         fetch(url, {
    //             method: "PATCH",
    //             headers: { 'Accept': 'application/json' }
    //         })
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 //console.log('data ', data)
    //                 if (data.error) {
    //                     throw new Error(data.error.message)
    //                 }
    //                 if (data.payload) {
    //                     reloadGroups();
    //                 }
    //             })
    //             .catch(err => {
    //                 handleError(err)
    //             });
    //     })

     }
    // const inviteToGroupListener = () => {
    //     setGroupInviteDialogOpen(true);
    // }

    //  const groupTitle = 'title'
    //const groupTitle = groups.find(g => g.id == group_id) ? groups.find(g => g.id == group_id).title : '';

    // let groupButtonDeleteText = '';
    // let groupButtonLeaveGroup = '';
    // let groupButtonJoinGroup = 'Join';
    // let groupButtonInvite = '';
    // let groupButtonAcceptInvite = '';
    // let groupButtonAwaitingJoinApprovalGroup = '';

    // if (groups && !Array.isArray(groups) && user) {
    //     if (groups.creator.id === user.id) {         
    //         groupButtonDeleteText = 'Delete Group';
    //         groupButtonInvite = 'Invite';
    //     } else {
    //         if (groups.awaiting_join_approval) {
    //             groupButtonAwaitingJoinApprovalGroup = 'Pending Approval'
    //         }
    //         if(groupInvites) {
    //             groupInvites.forEach(invite => {
    //                 if (invite.group.id === groups.id) {
    //                     groupButtonAcceptInvite = 'Accept invitation'
    //                 }
    //             })
    //         }
    //         if (groups.members.length > 0 && !groupButtonAcceptInvite) {
    //             const member = groups.members.filter(m => m.id === user.id);
    //             if (member && member.length > 0) {
    //                 groupButtonLeaveGroup = 'Leave Group';
    //                 groupButtonInvite = 'Invite';
    //             } else {
    //                 groupButtonJoinGroup = 'Join';
    //             }
    //         } else {              
    //             if (groupInvites) {                   
    //                 groupInvites.forEach(invite => {
    //                     if (invite.group.id === groups.id) {
    //                         groupButtonAcceptInvite = 'Accept invitation'
    //                     }
    //                 })
    //             }
    //             if (!groupButtonAcceptInvite) {
    //                 groupButtonJoinGroup = 'Join';
    //             }
    //         }
    //     }
    // }

    const newPostClickHandler = () => {
        setOpenNewPostDialog(true);
    }

    const [newMemberRequestsApproveDialogOpen, setNewMemberRequestsApproveDialogOpen] = useState(false);

    const approveMember = (user_id, group_id) => {
        newMemberRequestsApproveDialogCloseHandler()
     
        //Add member
        const member = users.find(u => u.id === user_id)
        if(member){
            setGroups(prev => {
                const group = prev.find(g => g.id === group_id);
                if(group) {
                    const existingMember = group.members.find(m => m.id === member.id) || group.creator.id === member.id;
                    if(!existingMember){
                        group.members.push(member);
                        return [...prev.filter(g => g.id !== group.id), group]
                    }
                    return prev;
                }
                return prev;

            })
        }

        //Filter join requests
        setJoinGroupRequests(prev => prev.filter(item => !(item.group.id === group_id && item.sender.id === user_id)))
       
        //Send Notification
        setNotifications(prev => {
            const group = groups.find(g => g.id === group_id)
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
            const sender = users.find(u => u.id === user_id);
            const content = sender.display_name + ' joined group: ' + group.title;
            
            const notification = {
                id,
                content,
                date:  Date.now(),
                sender,
                is_read: false
            }
                return [...prev, notification];
          });
    }
    const declineMember = (user_id, group_id) => {    
   
        newMemberRequestsApproveDialogCloseHandler();
        
        //Filter join requests
        setJoinGroupRequests(prev => prev.filter(item => !(item.group.id === group_id && item.sender.id === user_id)))
       
        //Send Notification
        setNotifications(prev => {
            const group = groups.find(g => g.id === group_id)
            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
            const sender = users.find(u => u.id === user_id);
            const content = sender.display_name + ' join request for group: ' + group.title + ' has been declined';
                    
            const notification = {
                    id,
                    content,
                    date:  Date.now(),
                    sender,
                    is_read: false
                }

            return [...prev, notification];
        });
        
        
    //     const session_id = getCookie(SESSION_ID);
    //     if (!session_id) {
    //         navigate('/signin');
    //         return;
    //     }
    //     const url = `${serverHost}/groups/requests/${group_id}?` + new URLSearchParams({ action: 'decline', member_id: user_id, session_id });

    //     fetch(url, {
    //         method: "PATCH",
    //         headers: { 'Accept': 'application/json' }
    //     })
    //         .then(resp => resp.json())
    //         .then(data => {
    //             console.log('approve group data ', data)
    //             if (data.error) {
    //                 throw new Error(data.error.message)
    //             }
    //             if (data.payload) {
    //                 reloadJoinRequests();
    //             }
    //         })
    //         .catch(err => {
    //             handleError(err)
    //         });
    }
    
    const newMemberRequestsButtonClickHandler = () => {
        setNewMemberRequestsApproveDialogOpen(true);
    }
    const newMemberRequestsApproveDialogCloseHandler = () => {
        setNewMemberRequestsApproveDialogOpen(false)
    }    

    useEffect(() => {      
        const group = groups.find(g => g.id == group_id);
        if(group === undefined) {           
            navigate('/signin');      
        }
        setGroup(group);

        const image = new Image();       

        if(group && group.image){
            image.src = group.image
        } else {
            image.src = imageURL;
            image.onload = () => setImage(image);
            image.onerror = () =>{
                setSrc(defaultBackground);
                setImage(true);
            }
        }
       
        if(group){
            const member = group.members.find(m => m.id === user.id) || group.creator.id === user.id;

            if(member) {
                if(group.creator.id === user.id){
                    setButtonsState(ButtonStates.Delete);
                }else{
                    setButtonsState(ButtonStates.Leave);
                }             
            } else {
                //If pending
                if(joinGroupRequests.find(item => item.group.id == group_id && item.sender.id === user.id)){
                    setButtonsState(ButtonStates.Pending);
                } else {
                    setButtonsState(ButtonStates.Join);
                }                   
            }
        }

        setJoinRequests(joinGroupRequests.filter(item => item.group.id == group_id && item.recipient.id === user.id));

    }, [joinGroupRequests, buttonsState, groups, group_id]);




    //const joinRequests = joinGroupRequests.filter(item => item.group.id == group_id && item.recipient.id === user.id);

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
                    {buttonsState === ButtonStates.Join && <Button variant='contained' onClick={joinGroupListener}>{ButtonStates.Join}</Button>}

                    {joinRequests && joinRequests.length > 0 && <Button variant='contained' onClick={newMemberRequestsButtonClickHandler}>New Member Requests: {joinRequests.length}</Button>}
                    {/* {groupButtonInvite && <Button variant='contained' onClick={inviteToGroupListener}>{groupButtonInvite}</Button>} */}
                    {/* {groupButtonAcceptInvite && <Button variant='contained' onClick={acceptInviteGroupListener}>{groupButtonAcceptInvite}</Button>} */}
                    {/* {groupButtonAcceptInvite && <Button variant='outlined' onClick={declineInviteGroupListener}>Decline Invitation</Button>} */}
                    {/* {groupButtonJoinGroup && !groupButtonAwaitingJoinApprovalGroup && <Button variant='contained' onClick={joinGroupListener}>{groupButtonJoinGroup}</Button>} */}
                    {buttonsState === ButtonStates.Pending && <Button variant='contained' disabled >{ButtonStates.Pending}</Button>}
                    {buttonsState === ButtonStates.Leave && <Button variant='outlined' onClick={leaveGroupListener}>{ButtonStates.Leave}</Button>}
                    {buttonsState === ButtonStates.Delete && <Button variant='outlined' onClick={deleteGroupListener}>{ButtonStates.Delete}</Button>}
                </Stack>

                <Grid container sx={{ py: 0, px: { xs: 1, md: 0 } }} >

                    <Grid item xs={12} md={4}>
                        <GuestGroupInfo group={group} />
                    </Grid>

                    <Grid item xs={12} md={8} sx={{ pl: { xs: 0, md: 1 }, pt: { xs: 1, md: 0 } }}>
                        {
                           group && (group.members.find(m => m.id === user.id) ||  group.creator.id === user.id) &&  <GuestNewPostButton sx={{ width: '100%' }} clickHandler={newPostClickHandler} />
                        }

                        <Tabs aria-label="post events tabs" value={tab} onChange={(event, newValue) => setTab(newValue)}>
                            <Tab label="Posts" />
                            <Tab label="Events" />
                        </Tabs>
                        {
                            tab === 0 && <GuestGroupPosts group_id={group_id} submitCommentHandler={submitCommentHandler} />
                        }
                        {
                            tab === 1 && <GuestGroupEvents group_id={group_id}/>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <GuestNewPostDialog
                open={openNewPostDialog}
                closeDialogHandler={newPostDialogCloseHandler}
                groupTitle={groups.find(g => g.id == group_id) ? groups.find(g => g.id == group_id).title : ''}              
                groupId={groups.find(g => g.id == group_id) ? groups.find(g => g.id == group_id).id : -1} />
            {/* <GroupInviteDialog group={groups} open={groupInviteDialogOpen} onClose={closeGroupInviteDialogHandler} onSubmit={submitGroupIviteDialogHandler} /> */}
            <GuestNewMemberRequestsApproveDialog 
                open={newMemberRequestsApproveDialogOpen}
                onClose={newMemberRequestsApproveDialogCloseHandler}
                requests={joinRequests}
                approveMember={approveMember}
                declineMember={declineMember}
            /> 
        </Grid>

    );
}

export default GroupGuest;