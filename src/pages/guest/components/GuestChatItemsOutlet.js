import { Stack } from "@mui/material";
import GuestChatItem from "./GuestChatItem";
import { useEffect, useState } from "react";
import { transformMessages } from "../../../util";
import { ProvideGuestData } from "./GuestDataContext";

const GuestChatItemsOutlet = ({ chats, chatSelectedHandler }) => {
  const [filtered, setFiltered] = useState();
 
  const [
    user,
    notifications, setNotifications,
    posts, setPosts,
    users, setUser,
    followers, setFollowers,
    chatMessages, setChatMessages,
    chatRooms, setChatRooms] = ProvideGuestData();


  useEffect(() => {
    setFiltered(chats)
  },[chats])





  //    useEffect(() => {
  //   if (user) {
  //     setFiltered(transformMessages(chats, user.id));
  //   }
  // }, [user]);

  return (
    <Stack>
      {filtered &&
        filtered.map((chat) => (
          <GuestChatItem
            key={chat.id}
            chat={chat}
            handleClick={chatSelectedHandler}
          />
        ))}
    </Stack>
  );

};

export default GuestChatItemsOutlet;
