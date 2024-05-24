import { Avatar, Skeleton } from "@mui/material";
import { buildImageUrl } from '../util';
import { ProvideUser } from "../context/UserContext";

const Icon = (props) => {
    const _size = props.size ? props.size : '48px';

    let initials = '';
    const [user] = ProvideUser();
    
    const u = props.user || user;

    if (u) {
        if (u.first_name && u.last_name) {
            initials = `${u.first_name.charAt(0)} ${u.last_name.charAt(0)}`
        }
        if (u.display_name) {
            initials = u.display_name.split(' ').map(word => word.charAt(0)).join(' ')
        }
    }

    return ( 
        u
        ?
        <Avatar
             alt="avatar"
             sx={{ width: _size, height: _size, ...props.sx }}
             src={
                  u.avatar ? buildImageUrl(u.avatar) : ''
             }>
             {initials}
        </Avatar>
        :
        <Skeleton variant="circular" width={_size} height={_size} />
     );
}
 
export default Icon;