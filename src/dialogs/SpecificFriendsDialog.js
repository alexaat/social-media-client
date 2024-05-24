import { Dialog, DialogContent, Button, Stack, Box, IconButton, Typography, DialogActions, DialogTitle } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { ProvideFollowers } from '../context/FollowersContext';
import SpecificFriendItem from '../components/SpecificFriendItem';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { NO_USER_FOUND, AUTHORIZATION } from '../constants';
import { handleError } from '../errors';


const SpecificFriendsDialog = ({
    open,
    clearAllHandler,
    goBackHandler,
    specificFriendIds,
    setSpecificFriendIds }) => {

    const selectHandler = (id) => {
        if (specificFriendIds.includes(id)) {
            setSpecificFriendIds(prev => [...prev.filter(_id => _id !== id)])
        } else {
            setSpecificFriendIds(prev => [id, ...prev])
        }
    }

    const [followers, reloadFollowers, followersError] = ProvideFollowers();

    const navigate = useNavigate();

    useEffect(() => {
        if(followersError) {
            if(followersError.type === NO_USER_FOUND) {
                navigate('/signin');            
            } else if(followersError.type !== AUTHORIZATION) {
                navigate('/');    
            } else {
                handleError(followersError);
            }
          }
    },[followersError]);

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
                    followers &&
                    followers.map(follower =>
                        <SpecificFriendItem
                            key={follower.follower.id}
                            follower={follower}
                            isSelected={specificFriendIds.includes(follower.follower.id)}
                            selectHandler={selectHandler}
                        />)
                }

            </DialogContent>

            <DialogActions sx={{ borderTop: 1, borderColor: '#eeeeee', py: 2 }}>
                <Button variant="contained" onClick={clearAllHandler}>Clear All</Button>
            </DialogActions>

        </Dialog>
    );
}

export default SpecificFriendsDialog;