import { Typography, Menu, MenuItem, Stack, Divider } from "@mui/material";
import {ProvideGuestData} from '../components/GuestDataContext';
import GuestNotificationItem from '../components/GuestNotificationItem';
import { useNavigate } from 'react-router-dom';

const GuestNotificationsMenu = ({ancor, onClose, setClickedNotification}) => {


    const [user, notifications, setNotifications] = ProvideGuestData();
    const navigate = useNavigate(); 

    const notificationsSorted = notifications.sort((a, b) => (a.id < b.id ? 1 : -1))

    const setRead = (notification) => {
        setNotifications(prev => {
            return prev.map(item => {
                if(item.id === notification.id){
                    return {...item, is_read: true} 
                } else {
                  return item;
                }
            })
        })
      };          

    const iconClickHandler = (id) => {
        navigate(`/guest/profile/${id}`);
        onClose();
    }  

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
        <Stack spacing={2} sx={{ ml: 2, mr: 8 }}>
          <Typography variant="h5">Notifications</Typography>
        </Stack>

        <Divider />


        {notificationsSorted && notificationsSorted.length > 0 ? (
          notificationsSorted.map((notification) => {
            return (
              <MenuItem
                key={notification.id}
                disableRipple
                sx={{ "&:hover": { backgroundColor: "white", cursor: "auto" } }}
              >
                <GuestNotificationItem
                  notification={notification}
                  iconClickHandler={iconClickHandler}                 
                  readClickHandler={setRead}
                />
              </MenuItem>
            );
          })
        ) : (
          <Stack>
            <Stack sx={{ px: 2, py: 1 }}>
              <Typography variant="body1"> No Notifications</Typography>
            </Stack>
          </Stack>
        )}
        
      </Menu>
     );
}
 
export default GuestNotificationsMenu;