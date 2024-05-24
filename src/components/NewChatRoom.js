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
import { handleError } from "../errors";
import CropEasy from "../crop/CropEasy";

const NewChatRoom = ({ save, error }) => {
  //Image
  const [imageType, setImageType] = useState('');
  const [openCrop, setOpenCrop] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  // const [imageLoaded, setImageLoaded] = useState(false);
  // const [img, setImg] = useState({});

  const [openNewChatDialog, setOpenNewChatDialog] = useState(false);
  const [chatRoomTitle, setChatRoomTitle] = useState("");
  //const [chatRoomImage, setChatRoomImage] = useState("");
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
    //setChatRoomImage("");
    setCroppedImage();
    setChatRoomTitle("");
    setOpenNewChatDialog(false);
  };

  const createNewChatRoomClickHandler = () => {
    save(chatRoomTitle, croppedImage);
    cancelChatRoomClickHandler();
  };

  useEffect(() => {
    setOpenNewChatDialog(Boolean(error));
  }, [error]);

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
            <Typography variant="body1">Create chat room</Typography>
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
             

              {/* <AddPhotoAlternateRoundedIcon /> */}
              <input type="file" name="chat-group-icon" accept="image/*" onChange={selelectedImageHandler} id="chat-group-icon" style={{ display: 'none' }} />
            </IconButton>
            <TextField
              helperText={error}
              error={Boolean(error)}
              label="Chat Room Name"
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

export default NewChatRoom;
