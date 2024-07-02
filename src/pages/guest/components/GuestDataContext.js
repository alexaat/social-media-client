import { useContext, useState, createContext, useEffect } from "react";

const data = {
    user: {
        id: 1,
        first_name: 'Guest',
        last_name: 'Special',
        display_name: 'Guest',
        avatar: 'http://alexaat.com/socialmedia/images/Guest.jpg',
        privacy: 'public'
    },
    users: [
        {
            id: 2,
            first_name: 'John',
            last_name: 'Lennon',
            display_name: 'John',
            avatar: 'http://alexaat.com/socialmedia/images/John.jpg'
        },
        {
            id: 3,
            first_name: 'Paul',
            last_name: 'McCartney',
            display_name: 'Paul',
            avatar: 'http://alexaat.com/socialmedia/images/Paul.jpg'
        },
        {
            id: 4,
            first_name: 'George',
            last_name: 'Harrison',
            display_name: 'George',
            avatar: 'http://alexaat.com/socialmedia/images/George.jpg'
        },
        {
            id: 5,
            first_name: 'Ringo',
            last_name: 'Starr',
            display_name: 'Ringo',
            avatar: 'http://alexaat.com/socialmedia/images/Ringo.jpg'
        }
    ],
    notifications:[
        {
            id: 1,
            content: 'note 1',
            date: Date.now(),
            sender: {
                id: 2,
                first_name: 'John',
                last_name: 'Lennon',
                display_name: 'John',
                avatar: 'http://alexaat.com/socialmedia/images/John.jpg'
            },
            is_read: false
        },
        {
            id: 2,
            content: 'note 2',
            date:  Date.now(),
            sender: {
                id: 3,
                first_name: 'Paul',
                last_name: 'McCartney',
                display_name: 'Paul',
                avatar: 'http://alexaat.com/socialmedia/images/Paul.jpg'
            },
            is_read: true
        }
    ],
    posts: [
        {
            id: 1,
            content: 'Performing on The Ed Sullivan Show, February 1964',
            date: Date.now()-1000*60*60*24*4,
            image: 'http://alexaat.com/socialmedia/images/post1.jpg',
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
                    date: Date.now(),
                    content: 'Comment 1'
                }
            ]
        },
        {
            id: 2,
            content: 'McCartney, Harrison and Lennon performing on Dutch TV in 1964',
            date: Date.now()-1000*60*60*24*2,
            image: 'http://alexaat.com/socialmedia/images/post2.png',
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
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: 'http://alexaat.com/socialmedia/images/George.jpg'
            },
            comments: []
        }
    ]    
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
   
    return (
        <GuestDataContext.Provider value={[user, notifications, setNotifications, posts, setPosts, users, setUser]}>
            {children}
        </GuestDataContext.Provider>
    );


}



