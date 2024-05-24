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
import { buildImageUrl, dateConverter } from '../util.js';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon.js';
import { ProvideUser } from "../context/UserContext.js";
import { UserProvider } from "../context/UserContext.js";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useState } from "react";
import CommentItem from "./CommentItem.js";
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsRoundedIcon from '@mui/icons-material/EmojiEmotionsRounded';
import { getCookie, SESSION_ID } from "../cookies.js";
import { serverHost, INVALID_COMMENT_FORMAT } from "../constants.js";
import { handleError } from "../errors.js";
import { ProvidePosts } from "../context/PostsContext.js";
import { useRef } from "react";

const Post = ({ post, sx }) => {

   const [posts, reloadPosts] = ProvidePosts()

   const imageInputId = `new-comment-image-${post.id}`

   //const postRef = useRef(post.id)

   //Submit comment handler
   const [submitCommentError, setSubmitCommentError] = useState(null);
   const submitCommentHandler = (postId, content, image) => {

      setSubmitCommentError(null)

      const session_id = getCookie(SESSION_ID);
      if (!session_id) {
         navigate('/signin');
         return;
      }

      const formData = new FormData();
      if (image) {
         formData.append('image', image);
      }
      formData.append('post_id', postId)
      formData.append('content', content)

      const url = `${serverHost}/comments?` + new URLSearchParams({ session_id });
      fetch(url, {
         method: "POST",
         body: formData,
         headers: { 'Accept': 'application/json' }
      })
         .then(resp => resp.json())
         .then(data => {
            //console.log('comment data ', data)
            if (data.error) {
               if (data.error.type === INVALID_COMMENT_FORMAT) {
                  setSubmitCommentError({ postId, message: data.error.message })
               } else {
                  throw new Error(data.error)
               }
            }
            if (data.payload) {
               if (reloadPosts) {
                  reloadPosts();
               }

            }
         })
         .catch(err => {
            handleError(err)
         });

   }

   //Emoji
   const [emojiDialogOpen, setEmojiDialogOpen] = useState(false);
   const selectEmojiHandler = (event) => {
      setComment(prev => prev + event.emoji)
   }

   const [image, setImage] = useState(null);

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
         setImage(file);
      } else {
         alert('error: Wrong image format')
      }
   }

   const submit = (id, val) => {
      submitCommentHandler(id, val, image)
      setImage(null)
      setComment('');
      setEmojiDialogOpen(false);
   }
   const [comment, setComment] = useState('');

   //User
   const [user] = ProvideUser();

   //Navigation
   const navigate = useNavigate();

   let publicity

   if (post.privacy) {
      publicity = <Tooltip title="Pubic"><PublicRoundedIcon /></Tooltip>

      if (post.privacy === "friends") {
         publicity = <Tooltip title="Friends"><PeopleRoundedIcon /></Tooltip>
      }
      if (post.specific_friends !== "") {
         publicity = <Tooltip title="Specific Friends"><PeopleOutlineRoundedIcon /></Tooltip>
      }
   }

   const clickHandler = () => {
      if (post.user.id === user.id) {
         navigate('/profile');
      } else {
         navigate(`/profile/${post.user.id}`);
      }
   }

   let userName = post.user.nick_name ? post.user.nick_name : post.user.first_name + " " + post.user.last_name;
   if(post.group) {
      userName += ` /  ${post.group.title}`;
   }

   const toolTip = "Follow"

   return (
      <>
         <Card sx={{ width: '500px', minHeight: '200px', mb: 2, ...sx }}>
            <CardContent>
               <Stack direction="column">
                  <Stack direction="row">
                     <IconButton aria-label="user icon" onClick={clickHandler} sx={{ width: '48px', height: '48px', mr: 2 }}>
                        <UserProvider person_id={post.user.id}>
                           <Icon />
                        </UserProvider>
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
                  {post.image && <Box component='img' src={post.image && buildImageUrl(post.image)} sx={{ width: '100%', height: '100%', backgroundSize: 'cover' }} ></Box>}

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
                                 {post.comments.map(comment => <CommentItem key={comment.id} comment={comment} />)}
                              </Stack>
                           }



                        </AccordionDetails>
                     </Accordion>
                  }
                  {
                     image && <Box component='img' sx={{ height: 'auto', width: '150px', pl: 2, pt: 1 }} src={URL.createObjectURL(image)}></Box>
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

export default Post;