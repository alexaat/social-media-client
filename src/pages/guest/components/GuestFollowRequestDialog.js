import {Typography, Accordion, AccordionSummary, AccordionDetails  } from '@mui/material';
// import { ProvideFollowers } from '../../../context/FollowersContext';
// import FollowRequestDialogItem from './FollowRequestDialogItem';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { handleError } from '../../../errors';
// import { getCookie, SESSION_ID } from '../../../cookies.js';
// import { serverHost, FOLLOW_REQUEST_NOT_FOUND } from '../../../constants.js'
// import { useNavigate } from 'react-router-dom';
import GuestFollowRequestDialogItem from './GuestFollowRequestDialogItem';

const GuestFollowRequestDialog = () => {

    // const navigate = useNavigate();

    // const [followers, reloadFollowers] = ProvideFollowers();
    // const followRequests = followers.filter(item => item.approved === false);

    // const approveFollowerHandler = (follower_id, approved) => {
    //     const session_id = getCookie(SESSION_ID);
    //     if (session_id) {
    //         fetch(serverHost + "/followers?" + new URLSearchParams({ session_id }),
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/x-www-form-urlencoded'
    //                 },
    //                 body: new URLSearchParams({                      
    //                     follower_id,
    //                     approved
    //                 })
    //             })
    //             .then(resp => resp.json())
    //             .then(data => {
    //                 if (data.error) {
    //                     if (data.error.type == FOLLOW_REQUEST_NOT_FOUND) {
    //                         alert(data.error.message);
    //                     } else {
    //                         throw new Error(data.error);
    //                     }
    //                 }else{
    //                     reloadFollowers();
    //                 }
    //             }).catch(err => handleError(err));         
    //     } else {           
    //         navigate('/signin');
    //     }
    // }

    // let component = <></>;
    // if (followRequests && followRequests.length === 1){
    //     component = <FollowRequestDialogItem requestItem={followRequests[0]} approveFollowerHandler={approveFollowerHandler}/>       
    // }
    // if (followRequests && followRequests.length > 1){
    //     component = 
    //         <Accordion sx={{mb: 1}}>
    //         <AccordionSummary  expandIcon={<ExpandMoreIcon />}>
    //             <Typography variant='subtitle1' sx={{fontSize: '1.1rem'}}>Follow Requests: {followRequests.length}</Typography>
    //             </AccordionSummary>
    //         <AccordionDetails sx={{maxHeight: '600px', overflowY: 'scroll', pb: 0}}>       

    //          {followRequests.map((element, index) => {               
    //               return <FollowRequestDialogItem key={index} requestItem={element} approveFollowerHandler={approveFollowerHandler}/> 
    //             }                          
    //          )}     
    
    //         </AccordionDetails>
    //         </Accordion>
    // }

    return (
        <>
        {/* {component} */}
        </>
    );
}

export default GuestFollowRequestDialog;