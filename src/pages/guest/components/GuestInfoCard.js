import { Typography, Stack, Paper } from "@mui/material";

const GuestInfoCard = ({ title, message, color }) => {
    return (
        <Paper elevation={1} sx={{ borderRadius: 1 }}>
            <Stack
                sx={{
                    minHeight: '250px',
                    alignItems: 'center',
                    pt: 4
                }}
            >
                {title && <Typography color={color} variant="h5" >{title}</Typography>}
                {message && <Typography variant="body1">{message}</Typography>}
            </Stack>
        </Paper>

    );
}
export default GuestInfoCard;