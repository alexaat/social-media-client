import { Stack } from "@mui/material";
import GuestChatMessage from "./GuestChatMessage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProvideGuestData } from "./GuestDataContext";
import { useDefaultReduceAnimations } from "@mui/x-date-pickers/internals";

const GuestChatMessagesOutlet = ({
  newChatMessage,
  reload,
  chatMate,
  reloadChatMessagesInToolBar,
}) => {

const [user, notifications, setNotifications, posts, setPosts, users, setUser, followers, setFollowers, chatMessages, setChatMessages] = ProvideGuestData();

const filtered = chatMessages ? chatMessages.filter(item => {
    if(item.sender.id === user.id && item.recipient.id === chatMate.id){
        return true;
    }
    if(item.recipient.id === user.id && item.sender.id === chatMate.id){
        return true
    }
    return false;
}) : undefined;

const sorted = filtered ? filtered.sort((a,b) => a.id < b.id ? 1 : -1) : undefined;

//   const [chatMessages, reloadChatMessages, error] = ProvideChatMessages();
//   const session_id = getCookie(SESSION_ID);

//   const navigate = useNavigate();

//   const [user] = ProvideUser()

//   if (!session_id) {
//     navigate("/signin");
//   }
//   useEffect(() => {
//     if (reloadChatMessages) {
//       reloadChatMessages();
//     }

//     //Set Messages as read for private message
//     if (chatMate && chatMate.type === "user") {
//       const url =
//         serverHost + "/chatmessages?" + new URLSearchParams({ session_id });
//       let headers = new Headers();
//       headers.append("Accept", "application/json");
//       headers.append("Content-Type", "application/x-www-form-urlencoded");
//       fetch(url, {
//         method: "PATCH",
//         headers: headers,
//         body: new URLSearchParams({
//           field: "is_read",
//           value: "true",
//           person_id: chatMate.id,
//         }),
//       })
//         .then((resp) => resp.json())
//         .then((data) => {
//           if (data.error) {
//             throw new Error(data.error);
//           }
//           if (data.payload) {
//             if (data.payload.updated > 0) {
//               reloadChatMessagesInToolBar();
//             }
//           }
//         })
//         .catch((err) => handleError(err));
//     }

//     if (chatMate && chatMate.type === "group" && user) {
//       //Join group

//             // Set Read
//             let url = serverHost + `/chatgroups/${chatMate.id}?` + new URLSearchParams({ session_id });
//             let headers = new Headers();
//             headers.append("Accept", "application/json");
//             headers.append("Content-Type", "application/x-www-form-urlencoded");
//             fetch(url, {
//               method: "PATCH",
//               headers: headers,
//               body: new URLSearchParams({
//                 add_member: user.id               
//               }),
//             })
//               .then((resp) => resp.json())
//               .then((data) => {
//                 //console.log("Data is_read for group", data);
//                 if (data.error) {
//                   throw new Error(data.error);
//                 }
//                 if (data.payload) {
//                   if (data.payload.updated > 0) {
//                     //reloadChatMessagesInToolBar();
//                   }
//                 }
//               })
//               .catch((err) => handleError(err));



//       // Set Read
//       url = serverHost + "/chatmessages?" + new URLSearchParams({ session_id });
//       fetch(url, {
//         method: "PATCH",
//         headers: headers,
//         body: new URLSearchParams({
//           field: "read_by",
//           value: "true",
//           chat_group_id: chatMate.id,
//         }),
//       })
//         .then((resp) => resp.json())
//         .then((data) => {
//           //console.log("Data is_read for group", data);
//           if (data.error) {
//             throw new Error(data.error);
//           }
//           if (data.payload) {
//             if (data.payload.updated > 0) {
//               //reloadChatMessagesInToolBar();
//             }
//           }
//         })
//         .catch((err) => handleError(err));
//     }
//   }, [reload, newChatMessage, user]);

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
      {sorted &&
        sorted.map((message) => (
          <GuestChatMessage
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

export default GuestChatMessagesOutlet;
