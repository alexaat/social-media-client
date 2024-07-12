import { useContext, useState, createContext } from "react";

// const imagesLocation = 'http://alexaat.com/socialmedia/images/';
export const imagesLocation = '/images/';

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
            avatar: imagesLocation + 'John.jpg',
            privacy: 'public',  
            email: 'john@thebeatles.uk',
            about_me: 'Life is what happens while you are busy making other plans.'
        },
        {
            id: 3,
            first_name: 'Paul',
            last_name: 'McCartney',
            display_name: 'Paul',
            avatar: imagesLocation + 'Paul.jpg',
            privacy: 'private',
            email: 'paul@thebeatles.uk',
            about_me: ''
        },
        {
            id: 4,
            first_name: 'George',
            last_name: 'Harrison',
            display_name: 'George',
            avatar: imagesLocation + 'George.jpg',
            privacy: 'public',
            email: 'george@thebeatles.uk',
            about_me: "Basically, I feel fortunate to have realized what the goal is in life. There's no point in dying having gone through your life without knowing who you are, what you are, or what the purpose of life is. And that's all it is."
        },
        {
            id: 5,
            first_name: 'Ringo',
            last_name: 'Starr',
            display_name: 'Ringo',
            avatar: imagesLocation + 'Ringo.jpg',
            privacy: 'private',
            email: 'ringo@thebeatles.uk',
            about_me: ''
        },
        {
            id: 6,
            first_name: 'Stuart',
            last_name: 'Sutcliffe',
            display_name: 'Stuart',
            avatar: imagesLocation + 'Stuart.jpg',
            privacy: 'private',
            email: 'stuartSutcliffe@gmail.com',
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
                avatar: imagesLocation + 'Guest.jpg',
            },
            is_read: false
        }
    ],
    posts: [
        {
            id: 1,
            content: 'Performing on The Ed Sullivan Show, February 1964',
            date: Date.now()-1000*60*60*24*4,
            image: imagesLocation + 'post1.jpg',
            privacy: 'public',
            sender: {
                id: 2,
                first_name: 'John',
                last_name: 'Lennon',
                display_name: 'John',
                avatar: imagesLocation + 'John.jpg'          
            },
            comments: [
                {
                    id: 1,
                    user:  {
                        id: 3,
                        first_name: 'Paul',
                        last_name: 'McCartney',
                        display_name: 'Paul',
                        avatar: imagesLocation +'Paul.jpg'
                    },
                    image: imagesLocation + 'comment1.jpg',
                    date: Date.now() - 1000*60*60*24,
                    content: 'Another image from this event'
                }
            ]
        },
        {
            id: 2,
            content: 'McCartney, Harrison and Lennon performing on Dutch TV in 1964',
            date: Date.now()-1000*60*60*24*2,
            image: imagesLocation + 'post2.png',
            privacy: 'public',
            sender: {
                id: 5,
                first_name: 'Ringo',
                last_name: 'Starr',
                display_name: 'Ringo',
                avatar: imagesLocation + 'Ringo.jpg'  
            },
            comments: []
        },
        {
            id: 3,
            content: 'Press conference in Minnesota in August 1965, shortly after playing at Shea Stadium in New York',
            date: Date.now() - 1000*60*60*10,
            image: imagesLocation + 'post3.jpg',
            privacy: 'public',
            sender: {
                id: 3,
                first_name: 'Paul',
                last_name: 'McCartney',
                display_name: 'Paul',
                avatar: imagesLocation + 'Paul.jpg'
            },
            comments: [],
        },
        {
            id: 4,
            content: 'Abbey Road crossing in London',
            image: imagesLocation + 'post4.jpg',
            date: Date.now() - 1000*60*60,
            privacy: 'public',
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: imagesLocation + 'George.jpg'
            },
            comments: []
        },
        {
            id: 5,
            content: 'Ths post is only available for my friends',
            image: imagesLocation + 'post5.jpg',
            date: Date.now() - 1000*60*30,
            privacy: 'friends',
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: imagesLocation + 'George.jpg'
            },
            comments: []
        },
        {
            id: 6,
            group_id: 1,
            content: "This Book Will Reveal How The Beatles Came Up With Their Last Original Album 'Let it Be'",
            image: imagesLocation + 'post6.jpeg',
            date: Date.now() - 1000*60*60*16,
            privacy: 'public',
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: imagesLocation + 'George.jpg'
            },
            comments: []
        },
        {
            id: 7,
            group_id: 1,
            content: "There was The Beatles… and then there was everyone else. And everyone else could be great, but The Beatles were leading the way and that's just irrefutably true.",
            image: imagesLocation + 'post7.jpeg',
            date: Date.now() - 1000*60*60*24*2,
            privacy: 'public',
            sender: {
                id: 2,
                first_name: 'John',
                last_name: 'Lennon',
                display_name: 'John',
                avatar: imagesLocation + 'John.jpg',
                privacy: 'public',
                email: 'john@thebeatles.uk',
                about_me: 'Life is what happens while you are busy making other plans.'
            },
            comments: []
        }
    ],
    followers: [],
    chatMessages: [
        {
            id: 3,
            sender: {
                id: 4,
                first_name: 'George',
                last_name: 'Harrison',
                display_name: 'George',
                avatar: imagesLocation + 'George.jpg',
                privacy: 'public',
                email: 'george@thebeatles.uk',
                about_me: "Basically, I feel fortunate to have realized what the goal is in life. There's no point in dying having gone through your life without knowing who you are, what you are, or what the purpose of life is. And that's all it is."
            },
            recipient: {                
                id: 1,
                title: 'old friends',
                image: imagesLocation + 'room1.jpeg'
            },
            content: 'hello, friends!!!',
            date: Date.now()-1000*60*60*24*3,
            read_by: '[4]',
            chat_group: 1
        },
        {
            id: 4,
            sender: {
                id: 3,
                first_name: 'Paul',
                last_name: 'McCartney',
                display_name: 'Paul',
                avatar: imagesLocation + 'Paul.jpg',
                privacy: 'private',
                email: 'paul@thebeatles.uk',
                about_me: ''
            },
            recipient: {                
                id: 1,
                title: 'old friends',
                image: imagesLocation + 'room1.jpeg'
            },
            content: 'hi, buddy',
            date: Date.now()-1000*60*60*12,
            read_by: '[3]',
            chat_group: 1
        }
    ],
    chatRooms: [
        {
            id: 1,
            title: 'old friends',
            image: imagesLocation + 'room1.jpeg'
        }
    ],
    groups: [
        {
            id: 1,
            title: 'The Beatles',
            description: 'English rock band formed in Liverpool in 1960',
            creator: {
                id: 2,
                first_name: 'John',
                last_name: 'Lennon',
                display_name: 'John',
                avatar: imagesLocation + 'John.jpg',
                privacy: 'public',
                email: 'john@thebeatles.uk',
                about_me: 'Life is what happens while you are busy making other plans.'
            },
            members: [

                {
                    id: 3,
                    first_name: 'Paul',
                    last_name: 'McCartney',
                    display_name: 'Paul',
                    avatar: imagesLocation + 'Paul.jpg',
                    privacy: 'private',
                    email: 'paul@thebeatles.uk',
                    about_me: ''
                },
                {
                    id: 4,
                    first_name: 'George',
                    last_name: 'Harrison',
                    display_name: 'George',
                    avatar: imagesLocation + 'George.jpg',
                    privacy: 'public',
                    email: 'george@thebeatles.uk',
                    about_me: "Basically, I feel fortunate to have realized what the goal is in life. There's no point in dying having gone through your life without knowing who you are, what you are, or what the purpose of life is. And that's all it is."
                },
                {
                    id: 5,
                    first_name: 'Ringo',
                    last_name: 'Starr',
                    display_name: 'Ringo',
                    avatar: imagesLocation + 'Ringo.jpg',
                    privacy: 'private',
                    email: 'ringo@thebeatles.uk',
                    about_me: ''
                }
            ]
        }
    ],
    events: [
        {
            id: 1,
            group_id: 1,
            creator: {
                id: 3,
                first_name: 'Paul',
                last_name: 'McCartney',
                display_name: 'Paul',
                avatar: imagesLocation + 'Paul.jpg',
                privacy: 'private',
                email: 'paul@thebeatles.uk',
                about_me: ''
            },
            create_date: Date.now() - 1000*60*60*24,
            title: 'Party',
            description: 'Birthday Party @ HQ. Start 7pm.',
            event_date: Date.now() + 1000*60*60*24*7,
            members: [
                {
                    id: 3,
                    first_name: 'Paul',
                    last_name: 'McCartney',
                    display_name: 'Paul',
                    avatar: imagesLocation + 'Paul.jpg',
                    privacy: 'private',
                    email: 'paul@thebeatles.uk',
                    about_me: ''
                },
                {
                    id: 5,
                    first_name: 'Ringo',
                    last_name: 'Starr',
                    display_name: 'Ringo',
                    avatar: imagesLocation + 'Ringo.jpg',
                    privacy: 'private',
                    email: 'ringo@thebeatles.uk',
                    about_me: ''
                }
            ]
        }
    ],
    joinGroupRequests: [],
    joinGroupInvites: [],
    logs: []
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
    const [chatMessages, setChatMessages] = useState(data.chatMessages);
    const [chatRooms, setChatRooms] = useState(data.chatRooms);
    const [groups, setGroups] = useState(data.groups);
    const [events, setEvents] = useState(data.events);
    const [joinGroupRequests, setJoinGroupRequests] = useState(data.joinGroupRequests);
    const [joinGroupInvites, setJoinGroupInvites] = useState(data.joinGroupInvites);
    const [logs, setLogs] = useState(data.joinGroupInvites);
   
    return (
        <GuestDataContext.Provider
            value={[
                user,
                notifications, setNotifications,
                posts, setPosts,
                users, setUser,
                followers, setFollowers,
                chatMessages, setChatMessages,
                chatRooms, setChatRooms,
                groups, setGroups,
                events, setEvents,
                joinGroupRequests, setJoinGroupRequests,
                joinGroupInvites, setJoinGroupInvites,
                logs, setLogs]}>
            {children}
        </GuestDataContext.Provider>
    );
}