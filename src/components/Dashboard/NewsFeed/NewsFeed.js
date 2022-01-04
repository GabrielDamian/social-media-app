import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';
import './NewsFeed.css';
import PageBlocked from '../PageBlocked/PageBlocked';

const NewsFeed = () => {

    const [haveAcces, setHaveAcces] = useState(false);
    const [currentUser, setCurrentUser] = useState('none');

    useEffect(()=>{
        store.subscribe(()=>{

            console.log("store updated!:",store.getState())
            setCurrentUser(store.getState().userID)
        })
    })
    useEffect(()=>{
        const config = {
            'token': localStorage.getItem('token')
        }
        axios.post('http://localhost:5000/api/verify-token',config)
            .then(res=>{
                store.dispatch({
                    type: 'update_id',
                    payload:{
                        newID: res.data._id
                    }
                })
                setHaveAcces(true);
            })
            .catch((err)=>{
                console.log(err)
                alert("Can't verify token!")
            })
    })

    
    const logOut = ()=>{
        localStorage.clear();
    }
    return (
        <>
        {
            haveAcces == true ? <NewsFeedContent logOut={logOut} currentUser={currentUser}/> : <PageBlocked/>
        }
        </>
    )
}

const PostItem = ({user_1, user_2, content,post_id})=>{

    return(
        <div className="post-container">
             {/* <span>-{user_1}</span>
            <span>-{user_2}</span>
            <span>-{content}</span>
            <span>-{post_id}</span>  */}

             <div className="post-header">
                <div className="post-header-top">
                    Post id: {post_id}
                </div>
                <div className="post-header-bottom">
                    by: {user_1} and {user_2}
                </div>
            </div>
            <div className="post-content">
                <img src={content} alt="post img"/>
            </div>
        </div>
    )
}
const NewsFeedContent = (props)=>{
    const [posts, setPosts] = useState([])

    const fetchPosts = ()=>{
        axios.post('http://localhost:5000/api/fetch-table-posts',{})
        .then(res=>{
            console.log("fetch table-posts:",res.data.lines);
            setPosts(res.data.lines)
        })
        .catch((err)=>{
            console.log(err)
            alert("Can't fetch table_posts.")
        
        })
    }

    useEffect(()=>{
        fetchPosts()
    },[])

    
    const [postFinal, setPostFinal] = useState([])
    
    useEffect(()=>{
        console.log("posts:", posts);
        if(posts.length != 0)
        {
            let arr_indexes = []
            posts.forEach((el, index)=>{
                if(index%2 == 0)
                {
                    arr_indexes.push(index)
                }
            })

            console.log("arr indexes:", arr_indexes)
            let arr_final_posts ={}
            
            arr_indexes.forEach((el)=>{
                arr_final_posts[el]={
                    post_value: '',
                    users: []
                }
            })

            arr_indexes.forEach((el)=>{

                posts.forEach((post_el)=>{
                    if(post_el.post_id == el)
                    {
                        arr_final_posts[el].users.push(post_el.by_user_id)
                        arr_final_posts[el].post_value = post_el.post_value
                    }
                })
            })

            console.log("maybe:", arr_final_posts)
            let arr_final_format =[]
            for(const item in arr_final_posts)
            {
                console.log("aici:", item, arr_final_posts[item]);
                let temp_obj = {}
                temp_obj['post_index'] = item
                temp_obj['post_value'] = arr_final_posts[item]['post_value']
                temp_obj['users'] = arr_final_posts[item]['users']
                arr_final_format.push(temp_obj)
            }
            console.log("arr_final_format:", arr_final_format);
            setPostFinal(arr_final_format.reverse());

            
        }
    
    },[posts])



    //post new action
    //get ge users before
    const [users, setUSers] = useState([])
    const fetchData = ()=>{
        axios.post('http://localhost:5000/api/fetch-table-users',{})
            .then(res=>{
                console.log("fetch table-users:",res.data.lines);
                setUSers(res.data.lines)
               
            })
            .catch((err)=>{
                
                console.log(err)
                alert("Can't fetch table_users.")
            })
    }
    useEffect(()=>{
        fetchData()
    },[])

    useEffect(()=>{
        console.log("USers ipdated:", users)
    },[users])


    const [newPostVal, setNewPostVal] = useState({
        postVal:'',
        otherUser:''
    })

    const handleNewPostChange = (e)=>{
        if(e.target.name == 'postVal')
        {
            setNewPostVal((prev)=>{
                return{
                    ...prev,
                    postVal: e.target.value
                }
            })
        }
        else if(e.target.name == 'otherUser')
        {
            setNewPostVal((prev)=>{
                return{
                    ...prev,
                    otherUser: e.target.value
                }
            })

        }

    }
    const handleSubmitPost = ()=>{
        if(newPostVal.postVal == '')
        {
            alert('Please complete post content!')
        }
        else if(newPostVal.otherUser == '')
        {
            alert('Please tag a user.')
        }
        else 
        {
            console.log("submit new post with:", newPostVal)
            axios.post('http://localhost:5000/api/add-table-posts',{
                post_value: newPostVal.postVal,
                user_1: props.currentUser,
                user_2: newPostVal.otherUser
            })
            .then(res=>{
                console.log("fetch table-posts:",res.data.lines);
                alert('Posted!')
                fetchPosts()
               
            })
            .catch((err)=>{
                alert("Can't post. Server error!")
            })
        }
    }

    return (
        <div className="newsfeed-container">
            <LeftBar />
            <div className="newsfeed-content">
                <div className="newsfeed-content-header">
                    <span>News Feed</span>
                </div>
                <div className="newsfeed-content-add-new">
                    <div className="newsfeed-content-add-padding">
                        <div className="newsfeed-content-add-title">
                            Post new:
                        </div>
                        <div className="newsfeed-content-add-total">
                            <textarea type="text" name="postVal" onChange={handleNewPostChange}/>
                            <div className="tag-other-user">
                                <span>Tag other:</span>
                                <select name="otherUser" onChange={handleNewPostChange}>
                                    {
                                        users.map((el)=>{
                                            if(props.currentUser != el.ID)
                                            {
                                                return(
                                                    <option value={el.ID}>{el.username}</option>
                                                )
                                            }
                                            
                                        })

                                    }
                                </select>
                            </div>
                            
                            <button onClick={handleSubmitPost}>Post</button>
                        </div>

                    </div>
                </div>
                <div className="newsfeed-content-scroll">
                    {
                       postFinal.map((el)=>{
                           return(
                            <PostItem
                                user_1={el.users[0]}
                                user_2={el.users[1]}
                                content={el.post_value}
                                post_id={el.post_index}
                            />
                           )
                       })
                    }
                </div>
            </div>
        </div>
    )
}


export default NewsFeed;
