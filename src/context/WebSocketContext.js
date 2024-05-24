import { useContext, useState, createContext, useEffect } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { wsEndPoint } from '../constants';
import {ProvideUser} from './UserContext';

const Context = createContext();

export const ProvideWebSocket = () => useContext(Context);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState();
    const [wsError, setWsError] = useState(null);

    const [user] = ProvideUser();

    useEffect(() => {
        if(user) {
            const session_id = getCookie(SESSION_ID);
            if (!session_id) {
                setWsError('user is no longer signed in')
                return;
            }
    
            const s = new WebSocket(`${wsEndPoint}?session_id=${session_id}`);
    
            setSocket(s)
    
            s.onerror = error => {
                setWsError(error)
            }
        }

    }, [user])

    return (
        <Context.Provider value={[socket, wsError]}>
            {children}
        </Context.Provider>
    );

}