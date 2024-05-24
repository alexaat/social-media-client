import { useContext, useState, createContext, useEffect } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { serverHost } from "../constants";

const GroupsContext = createContext([]);

export const ProvideGroups = () => useContext(GroupsContext);

export const GroupsProvider = ({ children, group_id }) => {

    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    //Trigger reload groups in useEffect
    const [reloadGroupsTrigger, setReloadGroupsTrigger] = useState(1);
    const reloadGroups = () => {          
        setReloadGroupsTrigger(Math.random());
    }

    //console.log('groups in context ', groups)

    useEffect(() => {

        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setGroups([]);
            setError('user is no longer signed in')
            return;
        }
    
        const url = group_id ? serverHost + `/groups/${group_id}?` + new URLSearchParams({ session_id }) : serverHost + "/groups?" + new URLSearchParams({ session_id })

        fetch(
            url,
            {
                method: "GET",
                headers: { 'Accept': 'application/json' }
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message);
                }
                if (data.payload) {
                    setGroups(data.payload);
                    //console.log('group: ', data.payload)
                } else {                  
                    setGroups([]);
                }
            })
            .catch(err => setError(err));

    },[reloadGroupsTrigger])

    return (
        <GroupsContext.Provider value={[groups, reloadGroups, error]}>
            {children}
        </GroupsContext.Provider>
    );
}