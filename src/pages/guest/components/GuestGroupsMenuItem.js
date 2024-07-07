import { Typography, Stack } from "@mui/material";

const GuestGroupsMenuItem = ({group, menuItemClickHandler}) => {    

    return ( 
        <Stack
            sx={{
                 mb: 1,
                 px: 2,
                 py: 1,
                 '&:hover' : {
                    cursor: 'pointer',
                    background: '#eeeeee'
                 }
            }}

            onClick={() => menuItemClickHandler(group)}
        >
            <Typography>{group.title}</Typography>
            <Typography>{group.description}</Typography>
        </Stack>
      
     );
}
 
export default GuestGroupsMenuItem;