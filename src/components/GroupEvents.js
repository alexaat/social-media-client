import { Stack, Card, CardContent, Typography } from "@mui/material";
import { ProvideEvents } from "../context/EventsContext";
import EventItem from "./EventItem";
import { AUTHORIZATION } from "../constants";
import { useEffect } from "react";

const GroupEvents = () => {

    const [events, reloadEvents, eventsError] = ProvideEvents();

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
                events && events.length > 0
                ?
                events.map(event => <EventItem key={event.id} event={event} />)
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

export default GroupEvents;