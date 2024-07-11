import { Stack } from "@mui/material";
import { ProvideGuestData } from "./GuestDataContext";
import GuestFollowersDetails from '../components/GuestFollowersDetails';


const GuestFollowersSummary = ({person_id}) => {

    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

    let followersFiltered = [];
    let followingsFiltered = [];

    if(person_id){

        followers.forEach(f => {
            if(f.followeeId == person_id && f.status === 'approved'){
                const _user = f.followerId === 1 ? user :  users.filter(u => u.id === f.followerId)[0];
                const result = {user: _user, date: f.date}
                followersFiltered.push(result)
            }
        })
        
        followers.forEach(f => {
            if(f.followerId == person_id && f.status === 'approved'){
                const _user = f.followeeId === 1 ? user : users.filter(u => u.id === f.followeeId)[0];
                const result = {user: _user, date: f.date}
                followingsFiltered.push(result)
            }
        })
       
    } else {      

        followers.forEach(f => {
            if(f.followeeId === user.id && f.status === 'approved'){
                const _user = users.filter(u => u.id === f.followerId)[0];
                const result = {user: _user, date: f.date}
                followersFiltered.push(result);
            }
        });

        followers.forEach(f => {
            if(f.followerId === user.id && f.status === 'approved'){
                const _user = users.filter(u => u.id === f.followeeId)[0];
                const result = {user: _user, date: f.date}
                followingsFiltered.push(result);
            }
        });      
    }
    return (
        <Stack spacing={1}>
            {followersFiltered && Array.isArray(followersFiltered) && followersFiltered.length > 0 && <GuestFollowersDetails arr={followersFiltered} title='Followers' />}
            {followingsFiltered && Array.isArray(followingsFiltered) && followingsFiltered.length > 0 && <GuestFollowersDetails arr={followingsFiltered} title='Followings'/>}
        </Stack>

    );
}

export default GuestFollowersSummary;