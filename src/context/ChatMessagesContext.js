import { useContext, useState, createContext, useEffect } from "react";
import { getCookie, SESSION_ID } from "../cookies";
import { serverHost } from "../constants";

const ChatMessagesContext = createContext([]);
export const ProvideChatMessages = () => useContext(ChatMessagesContext);

const ChatMessagesProvider = ({ children, chat_mate }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState(null);

  //Trigger reload chat messages in useEffect
  const [reloadChatMessagesTrigger, setReloadChatMessagesTrigger] = useState(1);
  const reloadChatMessages = () => {
    setReloadChatMessagesTrigger(Math.random());
  };

  useEffect(() => {
    const session_id = getCookie(SESSION_ID);
    if (!session_id) {
      setChatMessages([]);
      setError("user is no longer signed in");
      return;
    }

    let url = serverHost + "/chatmessages?";

    const params = new URLSearchParams({ session_id });

    if (chat_mate) {
      url = serverHost + "/chatmessages?";
      if (chat_mate.type === "group") {
        params.append("chat_group_id", chat_mate.id);
      } else if (chat_mate.type === "user") {
        params.append("recipient_id", chat_mate.id);
      }
    }
    url += params;

    fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error.message);
        }
        if (data.payload) {
          setChatMessages(data.payload);
        } else {
          setChatMessages([]);
        }
      })
      .catch((err) => setError(err));
  }, [reloadChatMessagesTrigger]);

  return (
    <ChatMessagesContext.Provider
      value={[chatMessages, reloadChatMessages, error]}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};

export default ChatMessagesProvider;
