import { ProvideGuestData } from "./GuestDataContext";
import GuestInfoCard from "./GuestInfoCard";
import GuestPost from './GuestPost';

const GuestPosts = ({person_id}) => {



  const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers] = ProvideGuestData();

  let components = undefined;

  if(person_id){
    const person = users.find(u => u.id == person_id);
    if(person.privacy === 'private'){
       const areFriends = followers.filter(item => {
          return (item.followerId == person_id && item.followeeId === user.id && item.status === 'approved') ||
                 (item.followeeId == person_id && item.followerId === user.id && item.status === 'approved')
       }).length > 0;

       if(!areFriends){
          components = <GuestInfoCard title='Private Account' message='This profile is private. Follow user to get access.' color='#FF0000' />
       }

    }
  }

  if(!components){
    const message = `All ${person_id ? 'new' : 'your'} posts will appear in this section`;
    const id = person_id ? person_id : user.id
  
    const filtered = posts.filter(post => post.sender.id == id);
    if(filtered.length === 0){
      components = <GuestInfoCard title='No Posts' message={message} color='#16c980' />
    } else {
      const sorted = filtered.sort((a,b) => (a.id<b.id ? 1 : -1))
      components = sorted.map(post => {

        if(post.privacy === 'public') {
          return <GuestPost sx={{ width: '100%' }} key={post.id} post={post}/>
        } else if (post.privacy === 'friends'){
          //Check that friends
          const areFriends = followers.filter(item => {
            return (item.followerId == post.sender.id && item.followeeId === user.id && item.status === 'approved') ||
            (item.followeeId == post.sender.id && item.followerId === user.id && item.status === 'approved')
          }).length > 0;

          if(areFriends){
            return <GuestPost sx={{ width: '100%' }} key={post.id} post={post}/>
          }
        }
    })
    }
  }  

  return (
      <> {components} </>
  )   
}

export default GuestPosts;