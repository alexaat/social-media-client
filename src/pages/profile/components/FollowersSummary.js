import { Stack } from "@mui/material";
import { ProvideFollowings } from "../../../context/FollowingsContext";
import { ProvideFollowers } from "../../../context/FollowersContext";
import FollowersDetails from "./FollowersDetails";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NO_USER_FOUND, AUTHORIZATION } from "../../../constants";
import { handleError } from "../../../errors";

const FollowersSummary = () => {

    const navigate = useNavigate();

    const [followers, reloadFollowers, followersError] = ProvideFollowers();
    const [followings, reloadFollowings, followingsError] = ProvideFollowings();

    useEffect(() => {
        if(followersError) {
            if(followersError.type === NO_USER_FOUND) {
                navigate('/signin');            
            } else if(followersError.type !== AUTHORIZATION) {
                console.log('followersError ',followersError);
            } else {
                handleError(followersError);
            }
        }
        if(followingsError) {
            if(followingsError.type === NO_USER_FOUND) {
                navigate('/signin');
            } else if(followingsError.type !== AUTHORIZATION) {
                console.log('followingsError ',followingsError)
            } else {
                handleError(followingsError);
            }
        }

    },[followersError,followingsError]);


    //Don't render summery if used doesn't have any followers nor followings
    const hasFollowings = followings && Array.isArray(followings) && followings.length > 0;
    const hasFollowers = followers && Array.isArray(followers) && followers.length > 0
    if (!hasFollowings && !hasFollowers) {
        return <></>;
    }

    // Filter followers that were not approved yet
    const followersFiltered = followers.filter(follower => follower.approved);
    const followingsFiltered = followings.filter(follower => follower.approved)

    return (
        <Stack spacing={1}>
            {followersFiltered && Array.isArray(followersFiltered) && followersFiltered.length > 0 && <FollowersDetails arr={followersFiltered} />}
            {followingsFiltered && Array.isArray(followingsFiltered) && followingsFiltered.length > 0 && <FollowersDetails arr={followingsFiltered} />}
        </Stack>

    );
}

export default FollowersSummary;