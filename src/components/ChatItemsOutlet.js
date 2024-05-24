import { Stack } from "@mui/material";
import ChatItem from "./ChatItem";
import { useEffect, useState } from "react";
import { transformMessages } from "../util";
import { ProvideUser } from "../context/UserContext";

const ChatItemsOutlet = ({ chats, chatSelectedHandler }) => {
  const [filtered, setFiltered] = useState();
  const [user] = ProvideUser();

  useEffect(() => {
    if (user) {
      setFiltered(transformMessages(chats, user.id));
    }
  }, [user]);

  return (
    <Stack>
      {filtered &&
        filtered.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            handleClick={chatSelectedHandler}
          />
        ))}
    </Stack>
  );

};

export default ChatItemsOutlet;
