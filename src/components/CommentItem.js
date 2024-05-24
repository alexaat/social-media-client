import { Stack, Typography, Box } from '@mui/material';
import Icon from './Icon';
import { dateConverter, buildImageUrl } from '../util';

const CommentItem = ({ comment }) => {
    return (
        <Stack sx={{ borderLeft: '4px solid', borderColor: 'primary.main', px: 1 }} >

            <Stack direction='row' justifyContent='space-between'>
                <Stack >
                    <Icon user={comment.user} size='24px' />
                    <Typography variant='body2' sx={{ fontSize: '12px', textDecoration: 'underline' }}>{comment.user.display_name}</Typography>
                </Stack>

                <Typography variant='body2' sx={{ fontSize: '12px' }}>{dateConverter(comment.date)}</Typography>
            </Stack>
            {
                comment.image && <Box component='img' sx={{ height: 'auto', width: '150px' }}  src={comment.image && buildImageUrl(comment.image)}></Box>
            }       

            <Typography variant='body2' sx={{ fontSize: '14px' }}>{comment.content}</Typography>
        </Stack>


    );
}

export default CommentItem;