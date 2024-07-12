import {
    Stack,
    Typography,
    Card,
    Tooltip,
    CardContent,
    IconButton,
    Box,
    Divider,
    TextField,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
 } from "@mui/material";
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import { dateConverter } from '../../../util.js';
import { useNavigate } from 'react-router-dom';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useEffect, useState } from "react";
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import GuestIcon from './GuestIcon.js';
import GuestCommentItem from "./GuestCommentItem.js";
import { ProvideGuestData } from "./GuestDataContext.js";
import { v4 as uuidv4 } from 'uuid';
import { imagesLocation } from '../components/GuestDataContext.js';
 
const GuestPost = ({ post, sx }) => {

   //Navigation
   const navigate = useNavigate();
 
   const [postImage, setPostImage] = useState();

   const [commentImage, setCommentImage] = useState();

   const [comments, setComments] = useState([]);

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

   useEffect(() => {
         if(post.image){
            /*
            if(isValidUrl(post.image)){
               setPostImage(post.image)
            } else {
               const src = localStorage.getItem(post.image);
               if(src){
                  setPostImage(src)
               } else {
                  setTimeout(() => {
                     setPostImage(localStorage.getItem(post.image))
                  }, 1000);  
               }             
            }
            */
            if(post.image.includes(imagesLocation)){
               setPostImage(post.image)
            }else{
               const src = localStorage.getItem(post.image);
               if(src){
                  setPostImage(src)
               } else {
                  setTimeout(() => {
                     setPostImage(localStorage.getItem(post.image))
                  }, 1000);  
               }               
            }
         }
         setComments(post.comments.sort((a,b) => a.date<b.date ? 1 : -1))

   }, [posts, postImage]);    

   const imageInputId = `new-comment-image-${post.id}`

   //Submit comment handler
   const [submitCommentError, setSubmitCommentError] = useState(null);
    
   const submitCommentHandler = (postId, content, commentImage) => {

      setSubmitCommentError(null);   

      if(content.length<2){
         setSubmitCommentError({postId, message: 'Comment is too short'})

      } else {        
         setPosts(posts => {
            const post = posts.filter(p => p.id === postId)[0];
                       
            const id = post.comments.length === 0 ? 1 : ((post.comments).sort((a, b) => (a.id < b.id ? 1 : -1)))[0].id + 1;
   
            //Save image
            let image = '';
            if(commentImage){
               const uuid = uuidv4();            
               const reader = new FileReader();
               reader.addEventListener("load", function () {
                  localStorage.setItem(uuid, reader.result);
               }, false);
               reader.readAsDataURL(commentImage);           
               image = uuid;            
            }
   
            const comment = {
               id,
               date: Date.now(),
               content,
               image,
               user
            }
   
            post.comments.push(comment);
   
            const newPosts = [...posts.filter(p => p.id !== post.id), post]
            
            return newPosts
         })
      } 
   }

   //Emoji
   const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
   const selectEmojiHandler = (event) => {
      setComment(prev => prev + event.emoji)
   }
   const imageClickListener = () => {
      let input = document.getElementById(imageInputId)
      input.value = '';
      input.click();
   }
    
   const error = submitCommentError && post.id === submitCommentError.postId
   const helperText = submitCommentError && submitCommentError.postId === post.id ? submitCommentError.message : ''

   
   const selelectedImageHandler = (e) => {
      let file = e.target.files[0];
      let fileType = file.type;
      if (fileType.startsWith('image/')) {
         setCommentImage(file);
      } else {
         alert('error: Wrong image format')
      }
   }

    
   const submit = (id, val) => {
      submitCommentHandler(id, val, commentImage)
      setCommentImage(null)
      setComment('');
      setEmojiDialogOpen(false);
   }
    
   const [comment, setComment] = useState('');

   let publicity
 
   if (post.privacy) {
      publicity = <Tooltip title="Pubic"><PublicRoundedIcon /></Tooltip> 
      if (post.privacy === "friends") {
          publicity = <Tooltip title="Friends"><PeopleRoundedIcon /></Tooltip>
      }
   }
 
   const clickHandler = () => {
      if (post.sender.id === user.id) {
         navigate('/guest/profile');
      } else {
         navigate(`/guest/profile/${post.sender.id}`);
      }
   }
 
   let userName = post.sender.display_name;
   if(post.group_id) {
      const group = groups.find(g => g.id === post.group_id);
      if(group){
        userName += ` /  ${group.title}`;
      }      
   }
    
   return (
       <>
          <Card sx={{ width: '500px', minHeight: '200px', mb: 2, ...sx }}>
             <CardContent>
                <Stack direction="column">
                   <Stack direction="row">
                      <IconButton
                        aria-label="user icon"
                        sx={{ width: '48px', height: '48px', mr: 2 }}
                        onClick={clickHandler}
                        >
                        <GuestIcon user={post.sender}/>
                       </IconButton>
 
                      <Stack direction="column">
                         <Typography variant="subtitle1">{userName}</Typography>
                         <Stack direction="row">
                            <Typography variant="subtitle1" sx={{ mr: 1 }}>{dateConverter(post.date)}</Typography>
                            {publicity}
                         </Stack>
                      </Stack>
                   </Stack>
 
                   <Divider sx={{ mt: 2, mb: 1 }} />
                   <Typography variant="body1" gutterBottom> {post.content}</Typography>

                     {
                        postImage && <Box component='img' src={postImage} sx={{ width: '100%', height: '100%', backgroundSize: 'cover' }} ></Box>                       
                     }
               
                     <input type="file" id={imageInputId} onChange={selelectedImageHandler} accept="image/*" style={{ display: 'none' }} /> 
                                      
                    {
                      comments.length > 0 && 
                      <Accordion
                         elevation={0}
                         square
                         disableGutters
                         sx={{
                            '& .MuiAccordionDetails-root': {
                               maxHeight: '300px',
                               overflowY: 'auto'
                            }
                         }}
 
                      >
                         <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Comments: {comments.length} </Typography>
                         </AccordionSummary>
                         <AccordionDetails>
                            {
                               comments &&
                               <Stack sx={{ pt: 4, pb: 1 }} spacing={1}>
                                  {comments.map(comment => <GuestCommentItem key={comment.id} comment={comment} />)}
                               </Stack>
                            }
 
                         </AccordionDetails>
                      </Accordion>
                   }
                   {
                     commentImage && <Box component='img' sx={{ height: 'auto', width: '150px', pl: 2, pt: 1 }} src={URL.createObjectURL(commentImage)}></Box>
                   } 
                   <TextField
                      error={error}
                      helperText={helperText}
                      sx={{ px: 2, pt: 8 }}
                      placeholder='Write comment here...'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      InputProps={{
                         endAdornment: (
                            <InputAdornment position="end">
                               <IconButton onClick={() => submit(post.id, comment)}>
                                  <SendRoundedIcon sx={{ color: "primary.main" }} />
                               </IconButton>
                            </InputAdornment>
                         )
                      }}
                      variant="standard"
                   /> 
                   <Stack direction='row' sx={{ px: 1 }}>
                      <IconButton onClick={imageClickListener}>
                         <InsertPhotoRoundedIcon />
                      </IconButton>
                      <IconButton onClick={() => setEmojiDialogOpen(!emojiDialogOpen)}>
                         <EmojiEmotionsRoundedIcon />
                      </IconButton>
                   </Stack>
                   <EmojiPicker onEmojiClick={selectEmojiHandler} open={emojiDialogOpen} />
 
                </Stack>
             </CardContent>
          </Card>
       </>
 
    );
 }
 
 export default GuestPost;