import { Stack } from "@mui/material";
import ChatMessage from "./ChatMessage";
import { ProvideChatMessages } from "../context/ChatMessagesContext";
import { useEffect } from "react";
import { getCookie, SESSION_ID } from "../cookies";
import { serverHost } from "../constants";
import { handleError } from "../errors";
import { useNavigate } from "react-router-dom";
import { ProvideUser } from "../context/UserContext";

const ChatMessagesOutlet = ({
  newChatMessage,
  reload,
  chatMate,
  reloadChatMessagesInToolBar,
}) => {
  const [chatMessages, reloadChatMessages, error] = ProvideChatMessages();
  const session_id = getCookie(SESSION_ID);

  const navigate = useNavigate();

  const [user] = ProvideUser()

  if (!session_id) {
    navigate("/signin");
  }
  useEffect(() => {
    if (reloadChatMessages) {
      reloadChatMessages();
    }

    //Set Messages as read for private message
    if (chatMate && chatMate.type === "user") {
      const url =
        serverHost + "/chatmessages?" + new URLSearchParams({ session_id });
      let headers = new Headers();
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      fetch(url, {
        method: "PATCH",
        headers: headers,
        body: new URLSearchParams({
          field: "is_read",
          value: "true",
          person_id: chatMate.id,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          if (data.payload) {
            if (data.payload.updated > 0) {
              reloadChatMessagesInToolBar();
            }
          }
        })
        .catch((err) => handleError(err));
    }

    if (chatMate && chatMate.type === "group" && user) {
      //Join group

            // Set Read
            let url = serverHost + `/chatgroups/${chatMate.id}?` + new URLSearchParams({ session_id });
            let headers = new Headers();
            headers.append("Accept", "application/json");
            headers.append("Content-Type", "application/x-www-form-urlencoded");
            fetch(url, {
              method: "PATCH",
              headers: headers,
              body: new URLSearchParams({
                add_member: user.id               
              }),
            })
              .then((resp) => resp.json())
              .then((data) => {
                //console.log("Data is_read for group", data);
                if (data.error) {
                  throw new Error(data.error);
                }
                if (data.payload) {
                  if (data.payload.updated > 0) {
                    //reloadChatMessagesInToolBar();
                  }
                }
              })
              .catch((err) => handleError(err));



      // Set Read
      url = serverHost + "/chatmessages?" + new URLSearchParams({ session_id });
      fetch(url, {
        method: "PATCH",
        headers: headers,
        body: new URLSearchParams({
          field: "read_by",
          value: "true",
          chat_group_id: chatMate.id,
        }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          //console.log("Data is_read for group", data);
          if (data.error) {
            throw new Error(data.error);
          }
          if (data.payload) {
            if (data.payload.updated > 0) {
              //reloadChatMessagesInToolBar();
            }
          }
        })
        .catch((err) => handleError(err));
    }
  }, [reload, newChatMessage, user]);

  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid #eeeeeeee",
        borderRadius: "4px",
        flex: "grow",
        height: "300px",
        p: 1,
        mt: 2,
        overflowY: "auto",
      }}
    >
      {chatMessages &&
        chatMessages.map((message) => (
          <ChatMessage
            key={message.id}
            sender_id={message.sender.id}
            title={message.sender.display_name}
            text={message.content}
            date={message.date}
          />
        ))}
    </Stack>
  );
};

export default ChatMessagesOutlet;
