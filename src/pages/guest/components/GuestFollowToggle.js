import { Button, Snackbar, Alert } from "@mui/material";
import { ProvideFollowings } from "../../../context/FollowingsContext";
import { AUTHORIZATION, serverHost } from "../../../constants";
import { getCookie, SESSION_ID } from "../../../cookies";
import { useNavigate } from 'react-router-dom';
import { handleError } from "../../../errors";
import { useState } from "react";
import { ProvideGuestData } from "./GuestDataContext";

const GuestFollowToggle = ({ person_id }) => {

    //const [followings, reloadFollowings] = ProvideFollowings();

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

    let isFollowing = undefined;

    //Navigation
    const navigate = useNavigate();

    //SnackBar
    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [severity, setSeverity] = useState('info');

    let text = 'Follow';
    let variant = 'contained';

    const followee = followers.filter(f => f.followerId === user.id && f.followeeId == person_id);
    // console.log('followers ',followers);
    // console.log('followee ',followee);
    if(followee && followee.length > 0){
        if(followee[0].status === 'approved'){
            isFollowing = true;
            text = 'Unfollow';
        } else if(followee[0].status === 'pending'){
            isFollowing = false;
            text = 'Pending';
        }
    }


    // if (person_id && followings && followings.length > 0) {

    //     const following = followings.filter(item => item.following.id == person_id)
    //     if (following.length > 0) {
    //         variant = 'outlined';
    //         if (following[0].approved) {
    //             isFollowing = true;
    //             text = 'Unfollow';
    //         } else {
    //             isFollowing = false;
    //             text = 'Pending';
    //         }
    //     }
    // }

    const setFollow = () => {
        const person = users.filter(u => u.id == person_id)[0];
        if(isFollowing === undefined){
            setFollowers(prev => {              
                const status = person.privacy === 'public' ? 'approved' : 'pending';
                const content =
                    status === 'pending'
                    ?
                    'Approve message sent to ' + person.display_name
                    :
                    status === 'approved'
                    ?
                    'You are following ' + person.display_name
                    :
                    '';
                
                if(content){
                    if(person.privacy === 'private'){
                        setSnackBarOpen(true);
                        setSnackBarMessage('Approve message sent');
                    }

                    setNotifications(prev => {

                        const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;
                       
                        const notification = {
                            id,
                            content,
                            date:  Date.now(),
                            sender: person,
                            is_read: false
                        }

                        return [...prev, notification];
                    });

                    //Ringo Decline
                    if(person_id == 5){
                        setTimeout(() => {
                        
                        setFollowers(prev => prev.filter(f => !(f.followerId === user.id && f.followeeId === person_id)))

                        setNotifications(prev => {
                            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;
            
                            const notification = {
                                id,
                                content: 'Follow request declined by ' + person.display_name,
                                date:  Date.now(),
                                sender: person,
                                is_read: false
                            }        
                            return [...prev, notification];
                        });

                        }, 5000);
                    }

                    //Paul approve
                    if(person_id == 3){
                        setTimeout(() => {
                        
                        //setFollowers(prev => prev.filter(f => !(f.followerId === user.id && f.followeeId === person_id)))
                        setFollowers(prev => prev.map(f => {
                            if(f.followerId == user.id && f.followeeId == person_id){
                                return {...f, status: 'approved', date: Date.now()}
                            } else {
                                return f
                            }
                        }))

                        setNotifications(prev => {
                            const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;
            
                            const notification = {
                                id,
                                content: 'You are following ' + person.display_name,
                                date:  Date.now(),
                                sender: person,
                                is_read: false
                            }        
                            return [...prev, notification];
                        });

                        }, 7000);
                    }

                }               
                
                const followItem = {date: Date.now(), followerId: user.id, followeeId: parseInt(person_id), status}
                return [...prev, followItem]
            });
        } else if(followee && followee.length > 0 && followee[0].status === 'approved'){
            setFollowers(prev => {  

                setNotifications(prev => {
                    const id =  prev.length === 0 ? 1 :  prev.sort((a,b) => (a.id < b.id ? 1 : -1 ))[0].id + 1;                      
                    const notification = {
                        id,
                        content: 'You stopped to follow ' + person.display_name,
                        date:  Date.now(),
                        sender: person,
                        is_read: false
                    }
                        return [...prev, notification];
                    })

                return prev.filter(f => !(f.followerId === user.id && f.followeeId == person_id)) 
            });
        }



        /*
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            navigate("/signin");
            return;
        }

        if (isFollowing === true) {
            //Unfollow
            fetch(serverHost + '/following?' + new URLSearchParams({ session_id, follow: person_id }),
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(resp => resp.json())
                .then(data => {

                    if (data.error) {
                        throw new Error(data.error)
                    }
                    reloadFollowings();
                })
                .catch(err => handleError(err));

        } else if (isFollowing === undefined) {
            fetch(serverHost + '/following?' + new URLSearchParams({ session_id }),
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams({
                        follow: person_id
                    })
                })
                .then(resp => resp.json())
                .then(data => {

                    if (data.error) {
                        if (data.error.type === AUTHORIZATION) {
                            setSnackBarMessage(data.error.message);
                            if (data.error.message.toLowerCase().trim().includes('error')) {
                                setSeverity('error')
                            }
                            setSnackBarOpen(true);
                        } else {
                            throw new Error(data.error);
                        }
                    }
                })
                .catch(err => handleError(`Here ${err}`));
                
        }
        */
    }

    return (
        <>
            {person_id &&
                <Button variant={variant} onClick={setFollow} disabled={isFollowing === false}>{text}</Button>
            }

            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackBarOpen(false)}
                message={snackBarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackBarOpen(false)} severity={severity} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default GuestFollowToggle;