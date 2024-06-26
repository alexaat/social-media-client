import { useContext, useState, createContext, useEffect } from "react";


const GuestDataContext = createContext();

export const ProvideGuestData = () => useContext(GuestDataContext)

export const GuestDataProvider = ( {children} ) => {
  
    

    const [user, setUser] = useState();
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            content: 'note 1',
            date: Date.now(),
            sender: {
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
                display_name: 'Guest',
                avatar: 'https://st.depositphotos.com/1301180/1334/v/950/depositphotos_13345374-stock-illustration-special-guest.jpg'
            },
            is_read: true
        }
    ]);
  
    useEffect(() => {
        setUser({
            display_name: 'Guest',
            avatar: 'https://st.depositphotos.com/1301180/1334/v/950/depositphotos_13345374-stock-illustration-special-guest.jpg'
        })
    },[])

    return (
        <GuestDataContext.Provider value={[user, notifications]}>
            {children}
        </GuestDataContext.Provider>
    );


}