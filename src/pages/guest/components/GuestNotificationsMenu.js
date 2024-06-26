import { Typography, Menu, MenuItem, Stack, Divider } from "@mui/material";
// import NotificationItem from "../components/NotificationItem";
// import { ProvideNotifications } from "../context/NotificationsContext";
// import { handleError } from "../errors";
import {ProvideGuestData} from '../components/GuestDataContext';
import GuestNotificationItem from '../components/GuestNotificationItem';
import { useNavigate } from 'react-router-dom';

const GuestNotificationsMenu = ({ancor, onClose, setClickedNotification}) => {


    const [user, notifications, setNotifications] = ProvideGuestData();
    const navigate = useNavigate();
   
   // const [notifications, reloadNotifications] = ProvideNotifications();

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
        navigate(`profile/${id}`);
        onClose();
    }  
    
    // const handleNotificationsItemClick = (id) => {
    //     //Get selected notification
    //     const notification = notifications.filter((n) => n.id === id)
    //       ? notifications.filter((n) => n.id === id)[0]
    //       : null;
    //     if (!notification) return;
    //     setRead(notification);
    //     setClickedNotification(notification);
    //     onClose();
    //   };

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


        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => {
            return (
              <MenuItem
                key={notification.id}
                disableRipple
                sx={{ "&:hover": { backgroundColor: "white", cursor: "auto" } }}
              >
                <GuestNotificationItem
                  notification={notification}
                  iconClickHandler={iconClickHandler}
                  //itemClickHandler={(id) => handleNotificationsItemClick(id)}
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