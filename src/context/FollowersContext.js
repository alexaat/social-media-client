import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie, SESSION_ID } from '../cookies';
import { serverHost, NO_USER_FOUND } from "../constants";

const FollowersContext = createContext([]);

export const ProvideFollowers = () => useContext(FollowersContext);

export const FollowersProvider = ({ children, person_id }) => {

    const navigate = useNavigate();

    const [followers, setFollowers] = useState([]);
    const [followersError, setFollowersError] = useState();

    //Trigger reload followers in useEffect
    const [reloadFollowersTrigger, setReloadFollowersTrigger] = useState(1);
    const reloadFollowers = () => {
        setReloadFollowersTrigger(Math.random());
    }

    useEffect(() => {
        setFollowersError();

        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setFollowersError({type: NO_USER_FOUND, message: 'User in not longer logged in'})
            return;
        }

        const url = person_id ?
        `${serverHost}/followers?${new URLSearchParams({person_id, session_id })}`
        :
        `${serverHost}/followers?${new URLSearchParams({ session_id })}`;

        fetch(
            url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    setFollowersError(data.error);
                    return;
                }
                if (data.payload) {
                    setFollowers(data.payload);
                } else {
                    setFollowers([]);
                }
            })
            .catch(err => setFollowers(err));

    }, [reloadFollowersTrigger])


    return (
        <FollowersContext.Provider value={[followers, reloadFollowers, followersError]}>
            {children}
        </FollowersContext.Provider>
    );
}