import { useNavigate } from 'react-router-dom';
import {Menu, MenuItem, Typography } from "@mui/material";


const GuestProfileMenu = ({ancor, onClose}) => {

    const navigate = useNavigate();
 
    const handleProfileItemClick = (destination) => {

        onClose();

        switch (destination) {
          case "profile":
            navigate("/guest/profile");
            break;
    
          case "signout":           
              navigate("/signin");
            break;
        }
      };

    return (
        <Menu
            open={Boolean(ancor)}
            anchorEl={ancor}
            onClose={onClose}
            anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
            }}
            transformOrigin={{
            vertical: "top",
            horizontal: "right",
            }}
        >
        <MenuItem onClick={() => handleProfileItemClick("profile")}>
            <Typography variant='body1'>
                Profile
            </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleProfileItemClick("signout")}>
            <Typography variant='body1'>
                Sign Out
            </Typography>            
        </MenuItem>
        </Menu>
    );
}

export default GuestProfileMenu;