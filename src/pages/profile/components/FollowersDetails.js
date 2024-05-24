import { Typography, Stack, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FollowerCard from "./FollowerCard";

const FollowersDetails = ({ arr }) => {

    let key = '';
    if (arr && Array.isArray(arr) && arr.length > 0) {
        key = Object.keys(arr[0])[0];
    }

    const title = key ? key.charAt(0).toLocaleUpperCase() + key.slice(1) + 's: ' + arr.length : '';

    return (
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
                        return <FollowerCard key={item[key].id} user={item[key]} date={item.date} />
                    })}
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}

export default FollowersDetails;