import { useContext, useState, createContext, useEffect } from "react";

const data = {
    user: {
        id: 1,
        first_name: 'Guest',
        last_name: '',
        display_name: 'Guest',
        avatar: 'https://st.depositphotos.com/1301180/1334/v/950/depositphotos_13345374-stock-illustration-special-guest.jpg'
    },
    users: [
        {
            id: 2,
            display_name: 'Alice',
            avatar: 'https://st.depositphotos.com/1301180/1334/v/950/depositphotos_13345374-stock-illustration-special-guest.jpg'
        }
    ],
    notifications:[
        {
            id: 1,
            content: 'note 1',
            date: Date.now(),
            sender: {
                id: 1,
                display_name: 'Guest',
                avatar: 'https://st.depositphotos.com/1301180/1334/v/950/depositphotos_13345374-stock-illustration-special-guest.jpg'
            },
            is_read: false
        },
        {
            id: 2,
            content: 'note 2',
            date:  Date.now(),
            sender: {
                id: 2,
                display_name: 'Guest',
                avatar: 'https://st.depositphotos.com/1301180/1334/v/950/depositphotos_13345374-stock-illustration-special-guest.jpg'
            },
            is_read: true
        }
    ],
    posts: [
        {
            id: 1,
            content: 'Post1',
            sender: {
                id: 2,
                display_name: 'Alice',                
            }
        },
        {
            id: 2,
            content: 'Post2',
            sender: {
                id: 3,
                display_name: 'Bob',                
            }
        }
    ]
    
}




const GuestDataContext = createContext();

export const ProvideGuestData = () => useContext(GuestDataContext)

export const GuestDataProvider = ( {children} ) => {
    

    const [user, setUser] = useState(data.user);
    const [notifications, setNotifications] = useState(data.notifications);
    const [posts, setPosts] = useState(data.posts);
   
    return (
        <GuestDataContext.Provider value={[user, notifications, setNotifications, posts]}>
            {children}
        </GuestDataContext.Provider>
    );


}



