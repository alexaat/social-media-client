import { useContext, useState, createContext, useEffect } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { AUTHORIZATION, serverHost } from "../constants";

const Context = createContext([]);

export const ProvideGroupInvites = () => useContext(Context);

export const GroupInvitesProvider = ({ children }) => {
    const [groupInvites, setGroupsInvites] = useState([]);
    const [error, setError] = useState(null);

    //Trigger reload in useEffect
    const [reloadTrigger, setReloadTrigger] = useState(1);
    const reloadInvites = () => {          
        setReloadTrigger(Math.random());
    }

    useEffect(() => {
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setGroupsInvites([]);
            setError('user is no longer signed in')
            return;
        }

        let url = `${serverHost}/groups/invites?` + new URLSearchParams({ session_id });
        fetch(url, {
            method: "GET",
            headers: { 'Accept': 'application/json' }
        })
            .then(resp => resp.json())
            .then(data => {
               // console.log('ivites data ', data)
                if (data.error) {
                    throw new Error(data.error)                  
                }
                if (data.payload) {
                    setGroupsInvites(data.payload)
                }
            })
            .catch(err => {
                setError(err)
            });

    },[reloadTrigger])

    return (
        <Context.Provider value={[groupInvites, reloadInvites, error]}>
            {children}
        </Context.Provider>
    );

}