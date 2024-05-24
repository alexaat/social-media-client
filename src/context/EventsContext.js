import { useContext, useState, createContext, useEffect } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { serverHost } from "../constants";

const Context = createContext([]);

export const ProvideEvents = () => useContext(Context);

export const EventsProvider = ({ children, groupId }) => {

    const [events, setEvents] = useState([]);
    const [eventsError, setEventsError] = useState(null);

    //Trigger reload in useEffect
    const [reloadTrigger, setReloadTrigger] = useState(1);
    const reloadEvents = () =>  setReloadTrigger(Math.random());    

    useEffect(() => {
        setEventsError(null)
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setEventsError('user is no longer signed in')
            return;
        }

        if (groupId) {
            let url = `${serverHost}/events?` + new URLSearchParams({ group_id: groupId, session_id });
            fetch(url, {
                method: "GET",
                headers: { 'Accept': 'application/json' }
            })
                .then(resp => resp.json())
                .then(data => {
                    //console.log('EVENT DATA ', data)
                    if (data.error) {
                        setEventsError(data.error)                      
                    }
                    if (data.payload) {
                        setEvents(data.payload)
                    }
                })
                .catch(err => {
                    //console.log('err ', err)
                    setEventsError(err)
                });
        }
    }, [reloadTrigger])

    return (
        <Context.Provider value={[events, reloadEvents, eventsError]}>
            {children}
        </Context.Provider>
    );
}