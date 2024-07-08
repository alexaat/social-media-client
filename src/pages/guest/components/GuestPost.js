import {
    Stack,
    Typography,
    Button,
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
    Paper
 } from "@mui/material";
 import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
 import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
 import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
 import { buildImageUrl, dateConverter } from '../../../util.js';
 import { useNavigate } from 'react-router-dom';
 //import Icon from './Icon.js';
//  import { ProvideUser } from "../context/UserContext.js";
//  import { UserProvider } from "../context/UserContext.js";
 import SendRoundedIcon from '@mui/icons-material/SendRounded';
 import { useEffect, useState } from "react";
//  import CommentItem from "./CommentItem.js";
 import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
 import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
 import EmojiPicker from "emoji-picker-react";
 import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';

//  import { handleError } from "../errors.js";
//  import { ProvidePosts } from "../context/PostsContext.js";
 import { useRef } from "react";
 import GuestIcon from './GuestIcon.js';
 import {isValidUrl} from '../../../util.js';
 import GuestCommentItem from "./GuestCommentItem.js";
import { ProvideGuestData } from "./GuestDataContext.js";
import { v4 as uuidv4 } from 'uuid';
 
 const GuestPost = ({ post, sx }) => {

       //Navigation
   const navigate = useNavigate();
 
    const [postImage, setPostImage] = useState();

    const [commentImage, setCommentImage] = useState();

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

    //const [src, setSrc] = useState(localStorage.getItem(post.image))

    //console.log('post ', post)

    useEffect(() => {
         if(post.image){
            if(isValidUrl(post.image)){
               setPostImage(post.image)
            } else {
               //console.log('isValidUrl: false')
               //const im = new Image();
               const src = localStorage.getItem(post.image);
               //console.log('src ',src)
               //im.src = src;
               //im.onload = function(){
               //   console.log('image loaded: ',src)
                  //setImage(src);
                  //setSrc(src);
               //}
               if(src){
                  setPostImage(src)
               } else {
                  setTimeout(() => {
                     setPostImage(localStorage.getItem(post.image))
                  }, 1000);  
               }             
            }
         }
    }, []);    


    /*
    const [posts, reloadPosts] = ProvidePosts()
   */
    const imageInputId = `new-comment-image-${post.id}`
    /*
 
    //const postRef = useRef(post.id)
 */
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
 







      //  const session_id = getCookie(SESSION_ID);
      //  if (!session_id) {
      //     navigate('/signin');
      //     return;
      //  }
 
      //  const formData = new FormData();
      //  if (image) {
      //     formData.append('image', image);
      //  }
      //  formData.append('post_id', postId)
      //  formData.append('content', content)
 
      //  const url = `${serverHost}/comments?` + new URLSearchParams({ session_id });
      //  fetch(url, {
      //     method: "POST",
      //     body: formData,
      //     headers: { 'Accept': 'application/json' }
      //  })
      //     .then(resp => resp.json())
      //     .then(data => {
      //        //console.log('comment data ', data)
      //        if (data.error) {
      //           if (data.error.type === INVALID_COMMENT_FORMAT) {
      //              setSubmitCommentError({ postId, message: data.error.message })
      //           } else {
      //              throw new Error(data.error)
      //           }
      //        }
      //        if (data.payload) {
      //           if (reloadPosts) {
      //              reloadPosts();
      //           }
 
      //        }
      //     })
      //     .catch(err => {
      //        handleError(err)
      //     });
 
    }
    /*
 */
    //Emoji
    const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
    const selectEmojiHandler = (event) => {
       setComment(prev => prev + event.emoji)
    }
 /*
    const [image, setImage] = useState(null);
 */
    const imageClickListener = () => {
       let input = document.getElementById(imageInputId)
       input.value = '';
       input.click();
    }
    
 
    //const error = submitCommentError && post.id === submitCommentError.postId
    //const helperText = submitCommentError && submitCommentError.postId === post.id ? submitCommentError.message : ''
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
    /*
 
    //User
    const [user] = ProvideUser();
 
*/
 
    let publicity
 
    if (post.privacy) {
       publicity = <Tooltip title="Pubic"><PublicRoundedIcon /></Tooltip>
 
      if (post.privacy === "friends") {
          publicity = <Tooltip title="Friends"><PeopleRoundedIcon /></Tooltip>
      }
      //  if (post.specific_friends !== "") {
      //     publicity = <Tooltip title="Specific Friends"><PeopleOutlineRoundedIcon /></Tooltip>
      //  }
    }
 
    const clickHandler = () => {
       if (post.sender.id === user.id) {
          navigate('/guest/profile');
       } else {
          navigate(`profile/${post.sender.id}`);
       }
    }
 
    let userName = post.sender.display_name;
    if(post.group_id) {
       const group = groups.find(g => g.id === post.group_id);
       if(group){
         userName += ` /  ${group.title}`;
       }
      
    }
 
   //  const toolTip = "Follow"
    
 
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

                   {/* {post.image && <Box component='img' src={post.image && buildImageUrl(post.image)} sx={{ width: '100%', height: '100%', backgroundSize: 'cover' }} ></Box>}  */}
                   <input type="file" id={imageInputId} onChange={selelectedImageHandler} accept="image/*" style={{ display: 'none' }} /> 
                   
                   
                   
                   {
                      post.comments.length > 0 && 
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
                            <Typography>Comments: {post.comments.length} </Typography>
                         </AccordionSummary>
                         <AccordionDetails>
                            {
                               post.comments &&
                               <Stack sx={{ pt: 4, pb: 1 }} spacing={1}>
                                  {post.comments.map(comment => <GuestCommentItem key={comment.id} comment={comment} />)}
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