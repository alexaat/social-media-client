import { Menu, Stack, Typography, Divider, IconButton } from "@mui/material";
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import GuestGroupsMenuItem from './GuestGroupsMenuItem'; 

const GroupsMenu = ({ groupsAncorEl, groupsCloseHandler, createGroupHandler, groups, menuItemClickHandler }) => {
    return (
        <Menu
            slotProps={{
                paper: {
                    sx: {
                        width: '350px'                        
                    }
                }
            }}
            open={Boolean(groupsAncorEl)}
            anchorEl={groupsAncorEl}
            onClose={groupsCloseHandler}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            <Stack spacing={2} sx={{ ml: 2, mr: 2 }} direction='row' justifyContent='space-between'>
                <Typography variant="h5">Groups</Typography>

                <IconButton
                    disableFocusRipple
                    disableRipple
                    sx={{ p: 0, m: 0 }}
                    aria-label="create group button"
                    onClick={createGroupHandler}
                >
                    <GroupAddRoundedIcon />
                </IconButton>
            </Stack>
            <Divider /> 
            <Stack spacing={1} sx={{py: 1}}>     
            {
                groups &&
                groups.map(group =><GuestGroupsMenuItem key={group.id} group={group} menuItemClickHandler={menuItemClickHandler}/>) 
            }
            {
                !groups || groups.length === 0 &&
                    <Stack sx={{px: 2}}>
                        <Typography variant="body1">No Groups</Typography>                  
                    </Stack>

            }
            </Stack>  
            
        </Menu>



    );
}

export default GroupsMenu;