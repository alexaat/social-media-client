import { useContext, useState, createContext } from "react";
import { getCookie, SESSION_ID } from '../cookies';
import { useEffect } from "react";
import { serverHost } from "../constants";

const PostsContext = createContext([]);
export const ProvidePosts = () => useContext(PostsContext);

export const PostsProvider = ({ children, person_id, group_id }) => {

    const [posts, setPosts] = useState([]);
    const [error, setError] = useState();

   // console.log('posts ', posts)

    //Trigger reload posts in useEffect
    const [reloadPostsTrigger, setReloadPostsTrigger] = useState(1);
    const reloadPosts = () => {
        setReloadPostsTrigger(Math.random());
    }

    useEffect(() => {
        setError(undefined);
        const session_id = getCookie(SESSION_ID);
        if (!session_id) {
            setPosts([]);
            setError('user is no longer signed in')
            return;
        }

        let url = serverHost + `/posts?` + new URLSearchParams({ session_id })
        if (person_id) {
            url += '&' + new URLSearchParams({ person_id })
        }
        if (group_id) {
            url += '&' + new URLSearchParams({ group_id })
        }

      // console.log('url ',url)

        fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(data => {
                //console.log('DATA ', data)
                if (data.error) {
                    setError(data.error);
                }
                if (data.payload) {
                    setPosts(data.payload);
                } else {
                    setPosts([]);
                }

            })
            .catch(err => setError(err));
    }, [reloadPostsTrigger]);

    return (
        <PostsContext.Provider value={[posts, reloadPosts, error]}>
            {children}
        </PostsContext.Provider>
    );
}

