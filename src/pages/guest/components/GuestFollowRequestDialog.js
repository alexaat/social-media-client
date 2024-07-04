import {Typography, Accordion, AccordionSummary, AccordionDetails  } from '@mui/material';
// import { ProvideFollowers } from '../../../context/FollowersContext';
// import FollowRequestDialogItem from './FollowRequestDialogItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { handleError } from '../../../errors';
// import { getCookie, SESSION_ID } from '../../../cookies.js';
// import { serverHost, FOLLOW_REQUEST_NOT_FOUND } from '../../../constants.js'
// import { useNavigate } from 'react-router-dom';
import GuestFollowRequestDialogItem from './GuestFollowRequestDialogItem';
import { ProvideGuestData } from './GuestDataContext';
import { useEffect } from 'react';
import { UserProvider } from '../../../context/UserContext';

const GuestFollowRequestDialog = () => {

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

    const followRequests = followers.filter(item => item.followeeId === user.id && item.status === 'pending');
   
    // useEffect(() => {
    //     console.log('user ', user)
    // },[user]);


    let component = <></>;
    if (followRequests && followRequests.length === 1){
       component = <GuestFollowRequestDialogItem requestItem={followRequests[0]}/>       
    }
    if (followRequests && followRequests.length > 1){
         component = 
            <Accordion sx={{mb: 1}}>
            <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
                <Typography variant='subtitle1' sx={{fontSize: '1.1rem'}}>Follow Requests: {followRequests.length}</Typography>
                </AccordionSummary>
            <AccordionDetails sx={{maxHeight: '600px', overflowY: 'scroll', pb: 0}}>       

             {followRequests.map((element, index) => {               
                  return <GuestFollowRequestDialogItem key={index} requestItem={element}/> 
                }                          
             )}     
    
            </AccordionDetails>
            </Accordion>
    }

    return (
        <>
        {component}
        </>
    );
}

export default GuestFollowRequestDialog;