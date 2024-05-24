import { useContext, useState, createContext, useEffect } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { serverHost } from "../constants";

const Context = createContext([]);

export const ProvideJoinRequests = () => useContext(Context);

export const JoinRequestsProvider = ({ children }) => {

    const [joinRequests, setJoinRequests] = useState();
    const [joinRequestError, setJoinRequestError] = useState(null);

    //Trigger reload in useEffect
    const [reloadTrigger, setReloadTrigger] = useState(1);
    const reloadJoinRequests = () => {
        setReloadTrigger(Math.random());
    }

    useEffect(() => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setJoinRequestError('user is no longer signed in')
            return;
        }

        const url = `${serverHost}/groups/requests?` + new URLSearchParams({ session_id });
        fetch(url, {
            method: "GET",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error)
                }
                if (data.payload) {
                    setJoinRequests(data.payload)
                }
            })
            .catch(err => {
                setJoinRequestError(err)
            });

    }, [reloadTrigger]);

    return (
        <Context.Provider value={[joinRequests, reloadJoinRequests, joinRequestError]}>
            {children}
        </Context.Provider>
    );
}