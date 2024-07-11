import { Dialog, DialogContent, Button, Stack, Box, IconButton, Typography, DialogActions, DialogTitle } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { ProvideGuestData } from './GuestDataContext';
import { useEffect, useState } from 'react';
import GuestSpecificFriendItem from './GuestSpecificFriendItem';

const GuestSpecificFriendsDialog = ({
    open,
    clearAllHandler,
    goBackHandler,
    specificFriendIds,
    setSpecificFriendIds }) => {


    const [user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms,
        groups, setGroups,
        events, setEvents,
        joinGroupRequests, setJoinGroupRequests] = ProvideGuestData();   
        
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const friendsMap = new Map();

        followers.forEach(item => {
            if(item.followerId === user.id){
               const friend = users.find(u => u.id === item.followeeId);
               if(friend){
                   friendsMap.set(item.followeeId, {...friend, date: item.date}); 
               }               
            }
            if(item.followeeId === user.id){
                const friend = users.find(u => u.id === item.followerId);
                if(friend){
                    friendsMap.set(item.follower, {...friend, date: item.date}) 
                }
            }
        });

        setFriends(Array.from(friendsMap.values()));

    },[open, followers]);
    
    

    const selectHandler = (id) => {
        if (specificFriendIds.includes(id)) {
            setSpecificFriendIds(prev => [...prev.filter(_id => _id !== id)])
        } else {
            setSpecificFriendIds(prev => [id, ...prev])
        }
    }

    return (
        <Dialog open={open}>
            <DialogTitle>
                <Stack direction="row" sx={{ height: '36px' }}>
                    <IconButton onClick={goBackHandler} sx={{ backgroundColor: '#eeeeee', width: '32px', height: '32px', mr: 1 }}>
                        <ArrowBackRoundedIcon />
                    </IconButton>
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h5" sx={{ textAlign: 'center' }}>Specific Friends</Typography>
                    </Box>
                </Stack>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    p: 1,
                    background: 'white',
                    position: 'relative',
                    minHeight: 400,
                    width: 'auto',
                    minWidth: { sm: 500 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    overflowY: 'auto'
                }}
            >
                {
                    friends && friends.map(friend => <GuestSpecificFriendItem
                        key={friend.id}
                        follower={friend}
                        isSelected={specificFriendIds.includes(friend.id)}
                        selectHandler={selectHandler}
                        date={friend.date}
                    />)
                }

            </DialogContent>

            <DialogActions sx={{ borderTop: 1, borderColor: '#eeeeee', py: 2 }}>
                <Button variant="contained" onClick={clearAllHandler}>Clear All</Button>
            </DialogActions>

        </Dialog>
    );
}

export default GuestSpecificFriendsDialog;