import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import ProfilePage from "./pages/profile";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ToolBar from "./ToolBar.js";
import { UserProvider } from './context/UserContext';
import { PostsProvider } from "./context/PostsContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { FollowingsProvider } from "./context/FollowingsContext";
import { FollowersProvider } from "./context/FollowersContext";
import ChatMessagesProvider from "./context/ChatMessagesContext.js";
import { GroupsProvider } from "./context/GroupsContext.js";
import Group from "./pages/group/index.js";
import { GroupInvitesProvider } from "./context/GroupInvitesContext.js";
import { WebSocketProvider } from "./context/WebSocketContext.js";
import { JoinRequestsProvider } from "./context/JoinRequestsProvider.js";
import HomeGuest from "./pages/guest/Home/index.js";
import GuestToolBar from "./pages/guest/components/GuestToolBar.js";
import { GuestDataProvider } from "./pages/guest/components/GuestDataContext.js";
import ProfileGuest from "./pages/guest/Profile/index.js";
import GroupGuest from "./pages/guest/Group/index.js";

function App() {

  return (
    <div className="App">
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/guest" element={            
              <GuestDataProvider>
                <GuestToolBar />
                <HomeGuest />
              </GuestDataProvider>                        
            } />
            
            <Route path="/guest/profile" element={
             <GuestDataProvider>
              <GuestToolBar />
              <ProfileGuest/>
            </GuestDataProvider>          
            } />


            <Route path="/guest/groups/:group_id" element={
             <GuestDataProvider>
              <GuestToolBar />
              <GroupGuest/>
            </GuestDataProvider>          
            } />

            <Route path="/guest/profile/:person_id" element={
             <GuestDataProvider>
              <GuestToolBar />
              <ProfileGuest/>
            </GuestDataProvider>          
            } />
            
            {['profile/', "profile/:person_id"].map(path => {
              return <Route
                key={path}
                path={path}
                element={
                  <WebSocketProvider>
                    <FollowersProvider>
                      <FollowingsProvider>
                        <NotificationsProvider>
                          <ChatMessagesProvider>
                            <GroupsProvider>
                              <ToolBar />
                            </GroupsProvider>
                          </ChatMessagesProvider>
                        </NotificationsProvider>
                        <PostsProvider>
                          <ProfilePage />
                        </PostsProvider>
                      </FollowingsProvider>
                    </FollowersProvider>
                  </WebSocketProvider>
                } />
            })}

            <Route index
              element={
                <WebSocketProvider>
                  <FollowersProvider>
                    <FollowingsProvider>
                      <NotificationsProvider>
                        <ChatMessagesProvider>
                          <GroupsProvider>
                            <ToolBar />
                          </GroupsProvider>
                        </ChatMessagesProvider>
                      </NotificationsProvider>
                      <PostsProvider>
                        <Home />
                      </PostsProvider>
                    </FollowingsProvider>
                  </FollowersProvider>
                </WebSocketProvider>
              }
            />

            <Route
              path="/groups"
              element={
                <WebSocketProvider>
                  <FollowersProvider>
                    <FollowingsProvider>
                      <NotificationsProvider>
                        <ChatMessagesProvider>
                          <GroupsProvider>
                            <ToolBar />
                          </GroupsProvider>
                        </ChatMessagesProvider>
                      </NotificationsProvider>
                      <PostsProvider>
                        <Home />
                      </PostsProvider>
                    </FollowingsProvider>
                  </FollowersProvider>
                </WebSocketProvider>
              }
            />

            <Route
              path={"groups/:group_id"}
              element={
                <WebSocketProvider>
                  <FollowersProvider>
                    <FollowingsProvider>
                      <NotificationsProvider>
                        <GroupInvitesProvider>
                          <JoinRequestsProvider>
                            <ChatMessagesProvider>
                              <GroupsProvider>
                                <ToolBar />
                                <Group />
                              </GroupsProvider>
                            </ChatMessagesProvider>
                          </JoinRequestsProvider>
                        </GroupInvitesProvider>
                      </NotificationsProvider>
                    </FollowingsProvider>
                  </FollowersProvider>
                </WebSocketProvider>
              } />
          </Routes>
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
