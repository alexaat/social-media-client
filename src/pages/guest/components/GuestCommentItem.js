import { Stack, Typography, Box } from '@mui/material';
import GuestIcon from './GuestIcon';
import { dateConverter, buildImageUrl, isValidUrl } from '../../../util';
import { useState, useEffect } from 'react';

const GuestCommentItem = ({ comment }) => {

    const [src, setSrc] = useState();

    useEffect(() => {

       if(comment.image){
          if(isValidUrl(comment.image)){
             setSrc(buildImageUrl(comment.image))
          } else {
             const src = localStorage.getItem(comment.image);
             if(src){
                setSrc(src)
             } else {
                setTimeout(() => {
                   setSrc(localStorage.getItem(comment.image))
                }, 1000);  
             }             
          }
       }
  }, []); 



    return (
        <Stack sx={{ borderLeft: '4px solid', borderColor: 'primary.main', px: 1 }} >

            <Stack direction='row' justifyContent='space-between'>
                <Stack >
                    <GuestIcon user={comment.user} size='24px' />
                    <Typography variant='body2' sx={{ fontSize: '12px', textDecoration: 'underline' }}>{comment.user.display_name}</Typography>
                </Stack>

                <Typography variant='body2' sx={{ fontSize: '12px' }}>{dateConverter(comment.date)}</Typography>
            </Stack>
            {
                 src && <Box component='img' sx={{ height: 'auto', width: '150px' }}  src={src}></Box>
                // comment.image && <Box component='img' sx={{ height: 'auto', width: '150px' }}  src={comment.image && buildImageUrl(comment.image)}></Box>
            }       

            <Typography variant='body2' sx={{ fontSize: '14px' }}>{comment.content}</Typography>
        </Stack>


    );
}

export default GuestCommentItem;