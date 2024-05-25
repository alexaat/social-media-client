import { useContext, useState, createContext } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { useEffect } from "react";
import { serverHost } from "../constants";
import { handleError } from "../errors";
import { useNavigate } from "react-router-dom";
import { NO_USER_FOUND } from "../constants"


const UserContext = createContext('')

export const ProvideUser = () => useContext(UserContext)

export const UserProvider = ({ children, person_id }) => {

    const [user, setUser] = useState();
    const [refreshUserTrigger, setRefreshUserTrigger] = useState(1);
    const reloadUser = () => {       
        setRefreshUserTrigger(Math.random());
    }

    //Navigation
    const navigate = useNavigate();

    useEffect(() => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setUser(null);
            navigate("/signin");
            return;
        }

        const url = person_id ?
            `${serverHost}/user/${person_id}?${new URLSearchParams({ session_id })}`
            :
            `${serverHost}/user?${new URLSearchParams({ session_id })}`;

        fetch(
            url,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                }
            })
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
                    setUser(data.payload);
                } else {
                    setUser(null);
                    navigate('/signin');
                }
            })
            .catch(err => handleError(err))

    }, [refreshUserTrigger]);

    return (
        <UserContext.Provider value={[user, reloadUser]}>
            {children}
        </UserContext.Provider>
    );
} 
