import { Divider, Stack, Typography, Checkbox, FormControlLabel, CardContent, Card, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useEffect, useState } from 'react';
import GuestIcon from '../../components/GuestIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { ProvideUser } from '../context/UserContext'
// import { SESSION_ID, getCookie } from '../cookies';
// import { serverHost } from '../constants';
// import { handleError } from '../errors';
// import { useNavigate } from 'react-router-dom';
// import { ProvideEvents } from '../context/EventsContext';
import { dateConverter, formatMilli } from '../../../../util';
import { ProvideGuestData } from '../../components/GuestDataContext';

const GuestEventItem = ({ event }) => {

    

    const [
        user,
        notifications, setNotifications,
        posts, setPosts,
        users, setUser,
        followers, setFollowers,
        chatMessages, setChatMessages,
        chatRooms, setChatRooms,
        groups, setGroups,
        events, setEvents,
        joinGroupRequests, setJoinGroupRequests] = ProvideGuestData();


    const [attend, setAttend] = useState(Boolean(event.members.find(u => u.id === user.id)));

    useEffect(() => {
        setAttend(Boolean(event.members.find(u => u.id === user.id)))
    },[events]);


    const checkBoxClickHandler = () => {
        // const session_id = getCookie(SESSION_ID);
        // if (!session_id) {
        //     navigate('/signin');
        //     return;

        

        if(attend){
            event.members = event.members.filter(m => m.id !== user.id);
            setEvents(prev => [...prev.filter(e => e.id !== event.id), event]);
            setAttend(false);

        } else {
            const member = event.members.find(m => m.id === user.id);
            if(!member){
                event.members.push(user);
                setEvents(prev => [...prev.filter(e => e.id !== event.id), event]);
                setAttend(true);
            }
        }



    }

    //     const url = `${serverHost}/events/${event.id}?` + new URLSearchParams({ attending: !attend, session_id });

    //     fetch(url, {
    //         method: "PATCH",
    //         headers: { 'Accept': 'application/json' }
    //     })
    //         .then(resp => resp.json())
    //         .then(data => {
    //             if (data.error) {
    //                 throw new Error(data.error.message)
    //             }
    //             if (data.payload) {
    //                 //reloadGroups();
    //                 //setReload(Math.random());
    //                 reloadEvents();
    //             }
    //         })
    //         .catch(err => {
    //             handleError(err)
    //         });

    //     setAttend(prev => !prev)
    // }

    // const [user] = ProvideUser();

    // useEffect(() => {
    //     if (event.members.filter(m => m.id === user.id).length > 0) {
    //         setAttend(true)
    //     }
    // }, []);


    return (
        <Card>
             <CardContent>
                <Stack>
                    <Stack direction='row' justifyContent='space-between'>
                        <Stack>
                            <GuestIcon user={event.creator} size="36" />
                            <Typography variant='body1' sx={{ fontSize: '14px' }}>{event.creator.display_name}</Typography>
                        </Stack>
                        <Typography variant='body1' sx={{ fontSize: '12px', fontWeight: '600' }}>Created: {dateConverter(event.create_date)}</Typography>
                    </Stack>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <Typography variant='h6'>{event.title}</Typography>
                    <Typography variant='body1'>{event.description}</Typography>
                    <Divider sx={{ mt: 1, mb: 1 }} />
                    <Typography variant='body1' sx={{ fontSize: '14px', textDecoration: 'underline' }}>Event Date:</Typography>
                    <Typography variant='h5' sx={{ fontWeight: '600', color: '#333' }}>{formatMilli(event.event_date)}</Typography>
                    <FormControlLabel control={<Checkbox checked={attend} onChange={checkBoxClickHandler} />} label="Attend" />

                    {
                        event.members && event.members.length > 0 &&
                        
                        <Accordion
                            square
                            disableGutters
                            sx={{
                                '& .MuiAccordionDetails-root': {
                                    maxHeight: '160px',
                                    overflowY: 'scroll'
                                },
                                pb: 1,
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'

                            }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography variant="subtitle1" sx={{fontSize: '18px'}}>Attending: {event.members.length}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ pb: 0 }} >

                                {
                                    event.members.map(member => (<Stack key={member.id} direction='row' spacing={2} sx={{mb: 2}} alignItems='center'><GuestIcon user={member} size='36px' /> <Typography variant='body1' sx={{fontWeight: '600', fontSize: '16px'}}>{member.display_name}</Typography></Stack>))
                                }

                            </AccordionDetails>
                        </Accordion>
                    }

                </Stack>

            </CardContent>

        </Card>

    );
}

export default GuestEventItem;