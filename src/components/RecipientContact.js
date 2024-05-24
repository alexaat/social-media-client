import { Stack, Typography, Box, IconButton } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const RecipientContact = ({chatMate, setChatMate}) => {
    return ( 
        <Stack direction='row' spacing={2} alignItems='center' sx={{mb: 1}} >
            <Typography>To</Typography>
            <Stack direction='row' alignItems='center' justifyContent='space-between'  sx={{pl: 2, borderRadius: '24px', minWidth: '160px', bgcolor: 'primary.main', height: '32px'}}>
                <Typography>{chatMate.name}</Typography>
                <IconButton onClick={() => setChatMate(null)}>
                <CloseRoundedIcon sx={{width: '16px', height: '16px'}}/>
            </IconButton>
        </Stack>

        </Stack> 
     );
}
 
export default RecipientContact;