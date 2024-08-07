import { Dialog, DialogContent, Button, Box, Stack, Typography, IconButton, Divider, TextField, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { PRIVACY_PUBLIC, PRIVACY_SPECIFIC_FRIENDS, PRIVACY_PRIVATE } from "../../../constants";
import { useState, useEffect } from 'react';
import GuestSpecificFriendsDialog from './GuestSpecificFriendsDialog';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import GuestEventDateTimePicker from '../Group/components/GuestEventDateTimePicker';
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import GuestIcon from '../components/GuestIcon';
import { ProvideGuestData } from './GuestDataContext';
import { v4 as uuidv4 } from 'uuid';


const GuestNewPostDialog = ({ open, closeDialogHandler, groupTitle, groupId, submitHandler }) => {

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

    const [error, setError] = useState('');
    const [eventTitleError, setEventTitleError] = useState();
    const [eventDescriptionError, setEventDescriptionError] = useState();
   
        
    //Emoji
    const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
    const selectEmojiHandler = event => setContent(prev => prev +event.emoji)

    
    const imageClickListener = () => {
        let input = document.getElementById('new-post-input-image')
        input.value = '';
        input.click();
    }
   
    //Event
    const SELECTION = {
        POST: 'post',
        EVENT: 'event'
    };
    const [selection, setSelection] = useState(SELECTION.POST);
    const setSelectionHandler = (e) => setSelection(e.target.value);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventDate, setEventDate] = useState();
    const [attend, setAttend] = useState(true);


    const [content, setContent] = useState('');
    const [privacy, setPrivacy] = useState(PRIVACY_PUBLIC);
    const [image, setImage] = useState(null);
    const [showSpecificFriendsDialog, setShowSpecificFriendsDialog] = useState(false);
    const [specificFriendIds, setSpecificFriendIds] = useState([]);

    const setPrivacyHandler = (e) => {
        const privacy = e.target.value
        setPrivacy(privacy);
        if (privacy === PRIVACY_SPECIFIC_FRIENDS) {
            setShowSpecificFriendsDialog(true);
        }
    }

    const clickSpecificFriends = () => {
        if (privacy === PRIVACY_SPECIFIC_FRIENDS) {
            setShowSpecificFriendsDialog(true);
        }
    }

    const submitPostHandler = () => {

        setEventTitleError();
        setEventDescriptionError();


        if (selection === SELECTION.POST) {

            if(content.length<2){
                setError('post content is too short')
            } else {
                //Save image to local strorage            
                //1. Generate key for image
                const uuid = uuidv4();
                
                const reader = new FileReader();
                reader.addEventListener("load", function () {
                localStorage.setItem(uuid, reader.result);
                }, false);
                if (image) {
                    reader.readAsDataURL(image);
                }

                //2. Save to data
                const id = posts.sort((a, b) => {
                    if(a.id<b.id){
                        return 1;
                    }
                    return -1;
                })[0].id + 1;

                const post = {
                    id,
                    content,
                    privacy: 'public',
                    image: uuid,
                    date: Date.now(),
                    sender: user,
                    comments: []
                }

                if(groupId){
                    post['group_id'] = groupId;
                }

                setPosts(prev => ([...prev, post]));

                //Reset State
                setContent('');        
                setPrivacy(PRIVACY_PUBLIC)
                setImage(null);
                setSpecificFriendIds([]);
                closeDialogHandler();
                setError('');
            }
        } else if(selection === SELECTION.EVENT){

                const eventTitleTrimmed = eventTitle.trim();
                const eventDescriptionTrimmed = eventDescription.trim();

                if(eventTitleTrimmed.length < 2 || eventTitleTrimmed.length > 25){
                    setEventTitleError('Error: event title must be between 2 and 25 characters long');
                    return;
                }

                if(eventDescriptionTrimmed.length < 2 || eventDescriptionTrimmed.length > 500){
                    setEventDescriptionError('Error: event description must be between 2 and 500 characters long');
                    return;
                }

                const id = events.length === 0 ? 1 : events.sort((a, b) => a.id<b.id ? 1 : -1)[0].id + 1;

                const members = attend ? [user] : []; 

                const event = {
                    id,
                    group_id: groupId,
                    creator: user,
                    create_date: Date.now(),
                    title: eventTitle,
                    description: eventDescription,
                    event_date: eventDate,
                    members
                }

                setEvents(prev => [...prev, event]);

                //Reset State
                closeDialogHandler();
                setEventDate('');
                setEventTitle('');
                setEventDescription('');
                setAttend(true);    
        }
     }

    const selelectedImageHandler = (e) => {
        let file = e.target.files[0];
        let fileType = file.type;
        if (fileType.startsWith('image/')) {
            setImage(file);
        } else {
            alert('error: Wrong image format')
        }
    }

    const closeDialogHandlerLocal = () => {
        setPrivacy(PRIVACY_PUBLIC);
        setContent('');
        closeDialogHandler();
        setSelection(SELECTION.POST);
        setEventTitleError();
        setEventDescriptionError();
        setEventDate();
        setEventTitle();
        setEventDescription();
        setAttend(true);  
    }

    const clearAllHandler = () => {
        setSpecificFriendIds([]);
    }

    const goBackHandler = () => {
        setShowSpecificFriendsDialog(false);
        if (specificFriendIds.length === 0) {
            setPrivacy(PRIVACY_PUBLIC);
        } else {
            setPrivacy(PRIVACY_SPECIFIC_FRIENDS);
        }
    }

    return (
        <>
            <Dialog open={open}>
                <DialogContent
                    dividers
                    sx={{
                        padding: 0,
                        background: 'white',
                        position: 'relative',
                        minHeight: 400,
                        width: '500px',
                        minWidth: { sm: 500 },
                    }}>

                    <Box sx={{ mt: 1, mb: 2, width: '100%' }}>
                        <Stack direction="row" sx={{ height: '56px' }}>
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h5" sx={{ textAlign: 'center' }}>{selection === SELECTION.POST ? 'Create Post' : selection === SELECTION.EVENT ? 'Create Event' : ''}</Typography>
                            </Box>
                            <IconButton onClick={closeDialogHandlerLocal} sx={{ backgroundColor: '#eeeeee', width: '32px', height: '32px', mr: 1 }}>
                                <CloseRoundedIcon />
                            </IconButton>
                        </Stack>

                        <Divider />

                        <Box sx={{ px: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>

                                <GuestIcon user={user}/>                             
                                {
                                    !groupTitle ?
                                        <Stack sx={{ ml: 2 }}>
                                          <Typography variant='subtitle1'>{user.display_name}</Typography>
                                              <TextField select value={privacy} onChange={setPrivacyHandler} size="small" InputProps={{ sx: { borderRadius: '8px' } }}>
                                                <MenuItem value={PRIVACY_PUBLIC}>{PRIVACY_PUBLIC}</MenuItem>
                                                <MenuItem value={PRIVACY_PRIVATE}>{PRIVACY_PRIVATE}</MenuItem>
                                                <MenuItem value={PRIVACY_SPECIFIC_FRIENDS} onClick={clickSpecificFriends}>{PRIVACY_SPECIFIC_FRIENDS}</MenuItem>
                                            </TextField>
                                        </Stack>
                                        :
                                        <Stack sx={{ ml: 2 }}>
                                            <Typography variant='subtitle1'>{user.display_name} / {groupTitle}</Typography>
                                            {
                                                groupTitle &&
                                                <TextField select value={selection} onChange={setSelectionHandler} size="small" InputProps={{ sx: { borderRadius: '4px' } }}>
                                                    <MenuItem value={SELECTION.POST}>{SELECTION.POST}</MenuItem>
                                                    <MenuItem value={SELECTION.EVENT}>{SELECTION.EVENT}</MenuItem>
                                                </TextField>
                                            }
                                        </Stack>
                                }
                            </Box>


                             {selection ===  SELECTION.POST &&
                                <Box sx={{
                                    width: '100%',
                                    minHeight: '170px',
                                    background: '#eeeeee',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mt: 2,
                                    border: 1,
                                    borderRadius: '4px',
                                    borderColor: '#dddddd',
                                    '&:hover': {
                                        cursor: 'pointer',
                                        borderColor: '#555555',
                                    }
                                }}
                                
                                    onClick={() => {
                                        let input = document.getElementById('new-post-input-image')
                                        input.value = '';
                                        input.click();
                                    }}
                                >                           
                                <input type="file" id='new-post-input-image' onChange={selelectedImageHandler} accept="image/*"/>                               
                                {                               
                                    (image && <Box component='img' sx={{ width: '100%', height: '100%', backgroundSize: 'cover' }} src={URL.createObjectURL(image)}></Box>) ||
                                    <IconButton aria-label="post image" disableRipple>
                                        <ImageRoundedIcon sx={{ width: '56px', height: '56px' }} />
                                    </IconButton>
                                }
                                </Box>
                            }

                            {
                                selection === SELECTION.POST ?
                                   
                                <Stack>
                                    <TextField
                                        error={Boolean(error)}
                                        helperText={error}
                                        sx={{ width: '100%', mt: 2 }}
                                        placeholder={`What't on your mind, ${user ? user.first_name : ''}?`}
                                        multiline
                                        rows={7}
                                        onChange={(e) => { setContent(e.target.value) }}
                                        value={content}
                                        InputProps={{ sx: { borderRadius: '4px' } }}
                                    />
                                    <Stack direction='row'>
                                        <IconButton onClick={imageClickListener}>
                                            <InsertPhotoRoundedIcon />
                                        </IconButton>
                                        <IconButton onClick={()=>setEmojiDialogOpen(!emojiDialogOpen)}>
                                            <EmojiEmotionsRoundedIcon />
                                        </IconButton>
                                    </Stack>                                
                                    <EmojiPicker onEmojiClick={selectEmojiHandler} open={emojiDialogOpen}/>

                                </Stack>
                                    : selection === SELECTION.EVENT ?
                                        <Stack>

                                            <FormControlLabel control={<Checkbox checked={attend} onChange={() => setAttend(prev => !prev)} />} label="Attend" />

                                            <GuestEventDateTimePicker setEventDate={setEventDate} />

                                            <TextField
                                                sx={{ width: '100%', mt: 2 }}
                                                error={Boolean(eventTitleError)}
                                                helperText={eventTitleError}
                                                placeholder='Event title'
                                                onChange={(e) => { setEventTitle(e.target.value) }}
                                                value={eventTitle}
                                                InputProps={{ sx: { borderRadius: '4px' } }}
                                            />
                                            <TextField
                                                error={Boolean(eventDescriptionError)}
                                                helperText={eventDescriptionError}
                                                sx={{ width: '100%', mt: 2 }}
                                                placeholder='Event description'
                                                multiline
                                                rows={4}
                                                onChange={(e) => { setEventDescription(e.target.value) }}
                                                value={eventDescription}
                                                InputProps={{ sx: { borderRadius: '4px' } }}
                                            />
                                        </Stack>
                                        :
                                        <></>
                            }

                            <Button
                                variant="contained"
                                sx={{ width: 1, mt: 2 }}
                                onClick={submitPostHandler}
                            >
                                <Typography variant='h6'>Save</Typography>
                            </Button>
                        </Box>
                    </Box>

                </DialogContent>
            </Dialog>

            <GuestSpecificFriendsDialog
                open={showSpecificFriendsDialog}
                clearAllHandler={clearAllHandler}
                goBackHandler={goBackHandler}
                specificFriendIds={specificFriendIds}
                setSpecificFriendIds={setSpecificFriendIds}
            />
        </>
    );
}

export default GuestNewPostDialog;