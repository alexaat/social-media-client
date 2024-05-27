import { Typography, Menu, MenuItem, Stack, Divider } from "@mui/material";
import NotificationItem from "../components/NotificationItem";
import { ProvideNotifications } from "../context/NotificationsContext";
import { useNavigate } from "react-router-dom";
import { getCookie, SESSION_ID } from "../cookies";
import { serverHost } from "../constants";
import { handleError } from "../errors";

const NotificationsMenu = ({ancor, onClose, setClickedNotification}) => {

    const navigate = useNavigate();
   
    const [notifications, reloadNotifications] = ProvideNotifications();

    const setRead = (notification) => {
        const session_id = getCookie(SESSION_ID);
        if(!session_id) {
            navigate('/signin');
            return;
        }

        const notification_id = notification.id;
        const url =
          serverHost + "/notifications?" + new URLSearchParams({ session_id });
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        };
        const body = new URLSearchParams({ notification_id });
        fetch(url, {
          method: "Post",
          headers,
          body,
        })
          .then((resp) => resp.json())
          .then((data) => {
            if (data.error) throw new Error(data.error);
            reloadNotifications();
          })
          .catch((err) => handleError(err));
      };

    const iconClickHandler = (id) => {
        navigate(`/profile/${id}`);
        onClose();
    }  
    
    const handleNotificationsItemClick = (id) => {
        //Get selected notification
        const notification = notifications.filter((n) => n.id === id)
          ? notifications.filter((n) => n.id === id)[0]
          : null;
        if (!notification) return;
        setRead(notification);
        setClickedNotification(notification);
        onClose();
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
                <NotificationItem
                  notification={notification}
                  iconClickHandler={iconClickHandler}
                  itemClickHandler={(id) => handleNotificationsItemClick(id)}
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
 
export default NotificationsMenu;