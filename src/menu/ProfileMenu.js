import { useNavigate } from 'react-router-dom';
import { SESSION_ID, deleteCookie, getCookie } from '../cookies';
import { serverHost } from '../constants';
import {Menu, MenuItem, Typography } from "@mui/material";
import { handleError } from '../errors';


const ProfileMenu = ({ancor, onClose}) => {

    const navigate = useNavigate();
 
    const handleProfileItemClick = (destination) => {

        onClose();

        const session_id = getCookie(SESSION_ID);
        if(!session_id) {
            navigate('/signin');
        }     
        switch (destination) {
          case "profile":
            navigate("/profile");
            break;
    
          case "signout":
            const session_id = getCookie(SESSION_ID);
            if (!session_id) {
              navigate("/signin");
              return;
            }
    
            fetch(serverHost + "/signout?" + new URLSearchParams({ session_id }), {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            })
              .then((resp) => resp.json())
              .then((data) => {
                if (data.error) {
                    throw new Error(data.error)
                }
              })
              .catch((err) => handleError(err));
    
            deleteCookie(SESSION_ID);
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

export default ProfileMenu;