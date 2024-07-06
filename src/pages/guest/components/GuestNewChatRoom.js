import {
    Typography,
    Stack,
    IconButton,
    Tooltip,
    TextField,
    Avatar
  } from "@mui/material";
  import { useEffect, useState } from "react";
  import AddRoundedIcon from "@mui/icons-material/AddRounded";
  import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
  import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
  import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
  import { handleError } from "../../../errors";
  import CropEasy from "../../../crop/CropEasy";
  import { ProvideGuestData } from "./GuestDataContext";
  
  const GuestNewChatRoom = () => {

    const [
      user,
      notifications, setNotifications,
      posts, setPosts,
      users, setUser,
      followers, setFollowers,
      chatMessages, setChatMessages,
      chatRooms, setChatRooms] = ProvideGuestData();

    //Image
    const [imageType, setImageType] = useState('');
    const [openCrop, setOpenCrop] = useState(false);
    const [photoURL, setPhotoURL] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
   
    const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
    const [chatRoomTitle, setChatRoomTitle] = useState("");

    const [newChatRoomError, setNewChatRoomError] = useState();

    const newChatRoomClickHandler = () => setOpenNewChatDialog(true);
    const newIconChatRoomClickHandler = () => {
      let input = document.getElementById('chat-group-icon')
      input.value = '';
      input.click();
    };
   const selelectedImageHandler = e => {
      let file = e.target.files[0]
      let fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/webp') {
          setImageType(fileType);
          setPhotoURL(URL.createObjectURL(file));
          setOpenCrop(true);
      } else if (fileType === 'image/gif') {
          setCroppedImage(file);
      } else {
          handleError(new Error('Wrong image format'));
      }
   }
  
    const cancelChatRoomClickHandler = () => {
      setCroppedImage();
      setChatRoomTitle("");
      setOpenNewChatDialog(false);
      setNewChatRoomError();
    };
  
    const createNewChatRoomClickHandler = () => {

      if(chatRoomTitle.trim().length < 2 || chatRoomTitle.trim().length > 50){
        setNewChatRoomError('Error: chat room title must be between 2 and 50 characters long')
        return;
      }
      if(chatRooms.find(room => room.title === chatRoomTitle.trim())){
        setNewChatRoomError(`Error: chat room with this title already exists`)
        return;
      }

      //Save
      const id = chatRooms.length === 0 ? 1 : chatRooms.sort((a,b) => a.id<b.id ? 1 : -1)[0].id + 1;
      const chatRoom = {
        id,
        title: chatRoomTitle.trim(),
        image: croppedImage
      }

      setChatRooms(prev => [...prev, chatRoom]);

      cancelChatRoomClickHandler();
    };
  
    // useEffect(() => {
    //   //setOpenNewChatDialog(Boolean(error));
    // }, []);
  
    return (
      <>
        {!openNewChatDialog ? (
          <Stack direction="row" justifyContent="end">
            <Tooltip title="New Chat Room">
              <IconButton onClick={newChatRoomClickHandler}>
                <AddRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ pl: 1 }}
            >
              <Typography variant="body1" sx={{color: '#777'}}></Typography>
              <Stack direction="row" justifyContent="end">
                <Tooltip title="Create">
                  <IconButton onClick={createNewChatRoomClickHandler}>
                    <DoneRoundedIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Close">
                  <IconButton onClick={cancelChatRoomClickHandler}>
                    <RemoveRoundedIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>
  
            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{ background: "#eee", width: "52px", height: "52px"}}
                onClick={newIconChatRoomClickHandler}
              >
                {
                  (croppedImage && <Avatar alt="avatar" src={URL.createObjectURL(croppedImage)} sx={{width: '52px', height: '52px' }}/>) || <AddPhotoAlternateRoundedIcon />
                }
               
               <input type="file" name="chat-group-icon" accept="image/*" onChange={selelectedImageHandler} id="chat-group-icon" style={{ display: 'none' }} />
              </IconButton>
              <TextField
                helperText={newChatRoomError}
                error={Boolean(newChatRoomError)}
                label="New Chat Room Name"
                variant="standard"
                onChange={(e) => setChatRoomTitle(e.target.value)}
                value={chatRoomTitle}
              />
            </Stack>
            <CropEasy {...{ photoURL, setOpenCrop, setPhotoURL, setCroppedImage }} open={openCrop} setOpen={setOpenCrop} imageType={imageType} />
          </Stack>
        )}
      </>
    );
  };
  
  export default GuestNewChatRoom;
  