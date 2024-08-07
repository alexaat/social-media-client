import { Stack, Card, CardContent, Typography } from "@mui/material";
import GuestEventItem from "../components/GuestEventItem";
import { AUTHORIZATION } from "../../../../constants";
import { ProvideGuestData } from "../../components/GuestDataContext";
import { useState, useEffect } from "react";

const GuestGroupEvents = ({group_id}) => {

    const [eventsError, setEventsError] = useState();

    const [sorted, setSorted] = useState([]);

    const [
        user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms,
        groups, setGroups,
        events, setEvents] = ProvideGuestData();

    useEffect(() => {   
       
        setEventsError();
        const group  = groups.find(g => g.id == group_id);
        if(group === undefined){
            setEventsError({type: 'data source', message: 'Error: cannot find group'})
        } else {
            const member = group.members.find(m => m.id === user.id) || group.creator.id === user.id;
            if(!member){
                setEventsError({type: AUTHORIZATION, message: 'Error: not group member'})
            } else {
                const filtered = events.filter(e => e.group_id == group_id);
                setSorted(filtered.sort((a,b) => a.id<b.id ? 1 : -1));               
            }
        }
    
    }, [groups, events, group_id]);

    return (
        <Stack spacing={1}>           
            
           {
                eventsError && eventsError.type === AUTHORIZATION ?
                <Card sx={{ width: '100%', height: '350px', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardContent >
                        <Stack >
                            <Typography variant="h5">Join group in order to see events</Typography>
            
                        </Stack>
                    </CardContent>
                </Card>
                :
                sorted && sorted.length > 0
                ?
                sorted.map(event => <GuestEventItem key={event.id} event={event} />)
                :
                <Card sx={{ width: '100%', height: '350px', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardContent >
                    <Stack >
                        <Typography variant="h5">No Events</Typography>
    
                    </Stack>
                    </CardContent>
                </Card>
           } 
        </Stack>
    );
}

export default GuestGroupEvents;
