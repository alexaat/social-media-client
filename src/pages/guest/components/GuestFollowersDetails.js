import { Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GuestFollowerCard from '../components/GuestFollowerCard';

const GuestFollowersDetails = ({ arr, title }) => {

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
                    {arr && arr.map((item, index) => {
                        if(item){
                            return <GuestFollowerCard key={index} user={item.user} date={item.date} />
                        }
                    })}
                </AccordionDetails>
            </Accordion>
        </Stack>
        :
        <></>     
    );
}

export default GuestFollowersDetails;