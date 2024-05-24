import { useContext, useState, createContext } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { useEffect } from "react";
import { serverHost, NO_USER_FOUND } from "../constants";
import { useNavigate } from "react-router-dom";

const FollowingsContext = createContext([]);

export const ProvideFollowings = () => useContext(FollowingsContext);

export const FollowingsProvider = ({ children, person_id }) => {
    const [followings, setFollowings] = useState([]);
    const [followingsError, setFollowingsError] = useState();

    //Trigger reload followings in useEffect
    const [reloadFollowingsTrigger, setReloadFollowingsTrigger] = useState(1);
    const reloadFollowings = () => {
        setReloadFollowingsTrigger(Math.random());
    }

    const navigate = useNavigate();

    useEffect(() => {
        setFollowingsError();

        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            //setFollowings([]);
            setFollowingsError({type: NO_USER_FOUND, message: 'User in not longer logged in'})
            return;
        }

        const url = person_id ?
        `${serverHost}/following?${new URLSearchParams({person_id, session_id })}`
        :
        `${serverHost}/following?${new URLSearchParams({ session_id })}`

        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setFollowingsError(data.error);                    
                }
                if (data.payload) {
                    setFollowings(data.payload);
                } else {
                    setFollowings([]);
                }
            })
            .catch(err => setFollowingsError(err));

    }, [reloadFollowingsTrigger]);

    return (
        <FollowingsContext.Provider value={[followings, reloadFollowings, followingsError]}>
            {children}
        </FollowingsContext.Provider>
    );
}