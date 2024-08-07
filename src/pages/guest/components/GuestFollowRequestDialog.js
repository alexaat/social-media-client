import {Typography, Accordion, AccordionSummary, AccordionDetails  } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GuestFollowRequestDialogItem from './GuestFollowRequestDialogItem';
import { ProvideGuestData } from './GuestDataContext';

const GuestFollowRequestDialog = () => {

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

    const followRequests = followers.filter(item => item.followeeId === user.id && item.status === 'pending');

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