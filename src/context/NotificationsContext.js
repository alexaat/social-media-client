import { useContext, useState, createContext } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { useEffect } from "react";
import { serverHost } from "../constants";
import { handleError } from "../errors";
import { NO_USER_FOUND } from "../constants";
import { useNavigate } from "react-router-dom";


const NotificationsContext = createContext([]);

export const ProvideNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);

    //Trigger reload notifications in useEffect
    const [reloadNotificationsTrigger, setReloadNotificationsTrigger] = useState(1);
    const reloadNotifications = () => {
        setReloadNotificationsTrigger(Math.random());
    }

    const navigate = useNavigate();

    useEffect(() => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setNotifications([]);
            return;
        }

        fetch(
            serverHost + "/notifications?" + new URLSearchParams({ session_id }),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }
        )
            .then(resp => resp.json())
            .then(data => {

                if (data.error) {
                    if (data.error.type === NO_USER_FOUND) {
                        navigate('/signin');
                        return;
                    } else {
                        throw new Error(data.error.message);
                    }
                }
                if (data.payload) {
                    setNotifications(data.payload);
                } else {
                    setNotifications([]);
                }
            })
            .catch(err => handleError(err));

    }, [reloadNotificationsTrigger]);

    return (
        <NotificationsContext.Provider value={[notifications, reloadNotifications]}>
            {children}
        </NotificationsContext.Provider>
    );
}