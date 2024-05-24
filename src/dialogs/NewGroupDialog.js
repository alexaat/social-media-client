import { Dialog, DialogActions, DialogContent, DialogTitle, Stack, IconButton, Typography, TextField, Button } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useEffect, useState } from "react";

const NewGroupDialog = ({ open, onClose, onSubmit, newGroupTitleError, newGroupDescriptionError }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')

    const closeHandler = () => {
        setTitle('');
        setDescription('');
        onClose();
    }
    useEffect(() => {
        setTitle('');
        setDescription('');
    }, [open])


    return (
        <Dialog
            open={open}
            PaperProps={{
                sx: {
                    minWidth: '400px', minHeight: '300px', p: 0, m: 0
                },
            }}
        >
            <DialogTitle>
                <Stack direction='row' justifyContent='space-between'>
                    <Typography variant="h6">New Group</Typography>
                    <IconButton
                        sx={{ p: 0, m: 0 }}
                        aria-label="close new chat dialog button"
                        onClick={closeHandler}
                    >
                        <CloseRoundedIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack sx={{ pt: 1 }} spacing={2}>
                    <TextField
                        error={newGroupTitleError ? true : undefined}
                        label='Group title'
                        onChange={e => setTitle(e.target.value)}
                        helperText={newGroupTitleError}
                        value={title}
                    />
                    <TextField
                        label='Group description'
                        multiline
                        minRows={4}
                        maxRows={4}
                        onChange={e => setDescription(e.target.value)}
                        error={newGroupDescriptionError ? true : undefined}
                        helperText={newGroupDescriptionError}
                        value={description}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" sx={{ mt: -1, mr: 2, mb: 1 }} onClick={() => onSubmit(title, description)}>Create</Button>
            </DialogActions>

        </Dialog>



    );
}

export default NewGroupDialog;