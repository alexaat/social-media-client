import { Avatar, Skeleton } from "@mui/material";

const Icon = (props) => {
    const _size = props.size ? props.size : '48px';

    let initials = '';
    
    const u = props.user;
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
             //src={require('../../../assets/John.jpg')}
            // src={u.avatar ?  u.avatar.includes('http') ? u.avatar : require(u.avatar) : ''}
             src={
                 u.avatar ? u.avatar : ''
             }
             >
             {initials}
        </Avatar>
        :
        <Skeleton variant="circular" width={_size} height={_size} />
     );
}
 
export default Icon;