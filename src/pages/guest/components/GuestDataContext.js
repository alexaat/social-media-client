import { useContext, useState, createContext, useEffect } from "react";

const data = {
    user: {
        id: 1,
        first_name: 'Guest',
        last_name: 'Special',
        display_name: 'Guest',
        avatar: 'http://alexaat.com/socialmedia/images/Guest.jpg',
        privacy: 'public',
        email: 'guest@special.com',
        about_me: 'Thank you for using social media'
    },
    users: [
        {
            id: 2,
            first_name: 'John',
            last_name: 'Lennon',
            display_name: 'John',
            avatar: 'http://alexaat.com/socialmedia/images/John.jpg',
            privacy: 'public',
            email: 'john@thebeatles.uk',
            about_me: 'Life is what happens while you are busy making other plans.'
        },
        {
            id: 3,
            first_name: 'Paul',
            last_name: 'McCartney',
            display_name: 'Paul',
            avatar: 'http://alexaat.com/socialmedia/images/Paul.jpg',
            privacy: 'private',
            email: 'paul@thebeatles.uk',
            about_me: ''
        },
        {
            id: 4,
            first_name: 'George',
            last_name: 'Harrison',
            display_name: 'George',
            avatar: 'http://alexaat.com/socialmedia/images/George.jpg',
            privacy: 'public',
            email: 'george@thebeatles.uk',
            about_me: "Basically, I feel fortunate to have realized what the goal is in life. There's no point in dying having gone through your life without knowing who you are, what you are, or what the purpose of life is. And that's all it is."
        },
        {
            id: 5,
            first_name: 'Ringo',
            last_name: 'Starr',
            display_name: 'Ringo',
            avatar: 'http://alexaat.com/socialmedia/images/Ringo.jpg',
            privacy: 'private',
            email: 'ringo@thebeatles.uk',
            about_me: ''
        }
    ],
    notifications:[
        {
            id: 1,
            content: 'Welcome to social media!',
            date: Date.now(),
            sender: {
                id: 1,
                first_name: 'Guest',
                last_name: 'Special',
                display_name: 'Guest',
                avatar: 'http://alexaat.com/socialmedia/images/Guest.jpg',
            },
            is_read: false
        }
    ],
    posts: [
        {
            id: 1,
            content: 'Performing on The Ed Sullivan Show, February 1964',
            date: Date.now()-1000*60*60*24*4,
            image: 'http://alexaat.com/socialmedia/images/post1.jpg',
            privacy: 'public',
            sender: {
                id: 2,
                first_name: 'John',
                last_name: 'Lennon',
                display_name: 'John',
                avatar: 'http://alexaat.com/socialmedia/images/John.jpg'          
            },
            comments: [
                {
                    id: 1,
                    user:  {
                        id: 3,
                        first_name: 'Paul',
                        last_name: 'McCartney',
                        display_name: 'Paul',
                        avatar: 'http://alexaat.com/socialmedia/images/Paul.jpg'
                    },
                    image: 'http://alexaat.com/socialmedia/images/comment1.jpg',
                    date: Date.now() - 1000*60*60*24,
                    content: 'Another image from this event'
                }
            ]
        },
        {
            id: 2,
            content: 'McCartney, Harrison and Lennon performing on Dutch TV in 1964',
            date: Date.now()-1000*60*60*24*2,
            image: 'http://alexaat.com/socialmedia/images/post2.png',
            privacy: 'public',
            sender: {
                id: 5,
                first_name: 'Ringo',
                last_name: 'Starr',
                display_name: 'Ringo',
                avatar: 'http://alexaat.com/socialmedia/images/Ringo.jpg'  
            },
            comments: []
        },
        {
            id: 3,
            content: 'Press conference in Minnesota in August 1965, shortly after playing at Shea Stadium in New York',
            date: Date.now() - 1000*60*60*10,
            image: 'http://alexaat.com/socialmedia/images/post3.jpg',
            privacy: 'public',
            sender: {
                id: 3,
                first_name: 'Paul',
                last_name: 'McCartney',
                display_name: 'Paul',
                avatar: 'http://alexaat.com/socialmedia/images/Paul.jpg'
            },
            comments: [],
        },
        {
            id: 4,
            content: 'Abbey Road crossing in London',
            image: 'http://alexaat.com/socialmedia/images/post4.jpg',
            date: Date.now() - 1000*60*60,
            privacy: 'public',
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: 'http://alexaat.com/socialmedia/images/George.jpg'
            },
            comments: []
        },
        {
            id: 5,
            content: 'Ths post is only available for my friends',
            image: 'http://alexaat.com/socialmedia/images/post5.jpg',
            date: Date.now() - 1000*60*30,
            privacy: 'friends',
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: 'http://alexaat.com/socialmedia/images/George.jpg'
            },
            comments: []
        }
    ],
    followers: []

}

const GuestDataContext = createContext();

export const ProvideGuestData = () => useContext(GuestDataContext)

export const GuestDataProvider = ( {children} ) => {
    

    const [user, setUser] = useState(data.user);
    const [notifications, setNotifications] = useState(data.notifications);
    const [posts, setPosts] = useState(data.posts.sort((a, b) => {
        if(a.id>b.id){
            return -1
        }
        return 1
    }));

    const [users, setUsers] = useState(data.users);
    const [followers, setFollowers] = useState(data.followers);
    
   
    return (
        <GuestDataContext.Provider value={[user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers]}>
            {children}
        </GuestDataContext.Provider>
    );


}



