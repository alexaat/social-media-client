import { Stack } from "@mui/material";
import GuestChatItem from "./GuestChatItem";
import { useEffect, useState } from "react";
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
