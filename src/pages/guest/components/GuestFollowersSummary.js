import { Stack } from "@mui/material";
// import { ProvideFollowings } from "../../../context/FollowingsContext";
// import { ProvideFollowers } from "../../../context/FollowersContext";
// import FollowersDetails from "./FollowersDetails";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { NO_USER_FOUND, AUTHORIZATION } from "../../../constants";
// import { handleError } from "../../../errors";
import { ProvideGuestData } from "./GuestDataContext";
import GuestFollowersDetails from '../components/GuestFollowersDetails';



const GuestFollowersSummary = ({person_id}) => {


    const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();


    //console.log('followers ',followers)

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

        followersFiltered = followers.map(f => {
            if(f.followeeId === user.id && f.status === 'approved'){
                const _user = users.filter(u => u.id == person_id)[0];
                return {user: _user, date: f.date}
            }
        });

        followingsFiltered = followers.map(f => {
            if(f.followerId === user.id && f.status === 'approved'){
                const user = users.filter(u => u.id == person_id)[0];
                return {user, date: f.date}
            }
        });
      
    }


    // const navigate = useNavigate();

    // const [followers, reloadFollowers, followersError] = ProvideFollowers();
    // const [followings, reloadFollowings, followingsError] = ProvideFollowings();

    // useEffect(() => {
    //     if(followersError) {
    //         if(followersError.type === NO_USER_FOUND) {
    //             navigate('/signin');            
    //         } else if(followersError.type !== AUTHORIZATION) {
    //             console.log('followersError ',followersError);
    //         } else {
    //             handleError(followersError);
    //         }
    //     }
    //     if(followingsError) {
    //         if(followingsError.type === NO_USER_FOUND) {
    //             navigate('/signin');
    //         } else if(followingsError.type !== AUTHORIZATION) {
    //             console.log('followingsError ',followingsError)
    //         } else {
    //             handleError(followingsError);
    //         }
    //     }

    // },[followersError,followingsError]);


    // //Don't render summery if used doesn't have any followers nor followings
    // const hasFollowings = followings && Array.isArray(followings) && followings.length > 0;
    // const hasFollowers = followers && Array.isArray(followers) && followers.length > 0
    // if (!hasFollowings && !hasFollowers) {
    //     return <></>;
    // }

    // // Filter followers that were not approved yet
    // const followersFiltered = followers.filter(follower => follower.approved);
    // const followingsFiltered = followings.filter(follower => follower.approved)




    return (
        <Stack spacing={1}>
            {followersFiltered && Array.isArray(followersFiltered) && followersFiltered.length > 0 && <GuestFollowersDetails arr={followersFiltered} title='Followers' />}
            {followingsFiltered && Array.isArray(followingsFiltered) && followingsFiltered.length > 0 && <GuestFollowersDetails arr={followingsFiltered} title='Followings'/>}
        </Stack>

    );
}

export default GuestFollowersSummary;