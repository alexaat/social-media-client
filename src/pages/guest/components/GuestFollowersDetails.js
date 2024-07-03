import { Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import FollowerCard from "./FollowerCard";
import GuestFollowerCard from '../components/GuestFollowerCard';
import { ProvideGuestData } from "./GuestDataContext";

const GuestFollowersDetails = ({ arr, title }) => {


    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

   // console.log('arr ',arr)

    // let key = '';
    // if (arr && Array.isArray(arr) && arr.length > 0) {
    //     key = Object.keys(arr[0])[0];
    // }

    //const title = key ? key.charAt(0).toLocaleUpperCase() + key.slice(1) + 's: ' + arr.length : '';

    return (
         arr && arr.length > 0 ?
            <Stack>
            <Accordion
                square
                disableGutters
                sx={{
                    '& .MuiAccordionDetails-root': {
                        maxHeight: '160px',
                        overflowY: 'scroll'
                    },
                    pb: 1,
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px'

                }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">{title}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pb: 0 }} >
                    {arr && arr.map(item => {
                        if(item){
                            return <GuestFollowerCard key={Date.now()} user={item.user} date={item.date} />
                        }     

                        // return <GuestFollowerCard key={item[key].id} user={item[key]} date={item.date} />
                    })}
                </AccordionDetails>
            </Accordion>
        </Stack>

        :
        <></>
        






       
    );
}

export default GuestFollowersDetails;