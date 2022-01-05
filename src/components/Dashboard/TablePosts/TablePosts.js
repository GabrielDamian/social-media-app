import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import './TablePosts.css';
import LeftBar from '../LeftBar/LeftBar';
import TrashIcon from '../../../media/trash-bin.png';
import PageBlocked from '../PageBlocked/PageBlocked';


const TablePosts = () => {


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
            haveAcces == true ? <TablePostsContent logOut={logOut} currentUser={currentUser}/> : <PageBlocked/>
        }
        </>
    )
}


const TablePostsContent = (props)=>{

    //get users
    const [users, setUsers] = useState([]);
    const fetchUserData = ()=>{
        axios.post('http://localhost:5000/api/fetch-table-users',{})
            .then(res=>{
                console.log("fetch table-users:",res.data.lines);
                setUsers(res.data.lines)
               
            })
            .catch((err)=>{console.log(err)})
    }

    useEffect(()=>{
        console.log('fetch user data')
        fetchUserData();
    },[])

    //get posts data
    const [postsData, setPostsData] = useState([]);

    const fetchPostsData = ()=>{
        console.log("fetch post data!!!!!")
        axios.post('http://localhost:5000/api/fetch-table-posts',{})
            .then(res=>{
                console.log("fetch table-posts:",res.data.lines);
                setPostsData(res.data.lines)
            })
            .catch((err)=>{console.log(err)})
    }

    useEffect(()=>{
        console.log('fetch posts data')
        fetchPostsData();
    },[])

    useEffect(()=>{
        console.log("postsData update:",postsData)
    },[postsData])

    //Add item action
    const [newAddItem,setNewAddItem] = useState({
        user_1:'',
        user_2:'',
        post_value:''
    })
    const handleAddNewItemChange = (e)=>{

        if(e.target.name == 'user_1')
        {
            setNewAddItem((prev)=>{
                return{
                    ...prev,
                    user_1: e.target.value
                }
            })
        }
        else if(e.target.name == 'user_2')
        {
            setNewAddItem((prev)=>{
                return{
                    ...prev,
                    user_2: e.target.value
                }
            })
        }
        else if(e.target.name == 'post-value')
        {
            setNewAddItem((prev)=>{
                return{
                    ...prev,
                    post_value: e.target.value
                }
            })
        }
    }

    const submitAddNewPost = ()=>{
        if(newAddItem.user_1 == '')
        {
            alert('Please complete user_1 field')
        }
        else if(newAddItem.user_2 == '')
        {
            alert('Please complete user_2 field')
            
        }
        else if(newAddItem.post_value == '')
        {
            alert("Please complete post's value field")
        }
        else if(newAddItem.user_1 == newAddItem.user_2) 
        {
            alert(`User ${newAddItem.user_1} can't tag himself!`)
        }
        else 
        {

            //!!!!!!! COMPLETE FIELDS
            console.log('fetch add cu datele', newAddItem)
            axios.post('http://localhost:5000/api/add-table-posts',{
                post_value: newAddItem.post_value,
                user_1: newAddItem.user_1,
                user_2:newAddItem.user_2
            })
            .then(res=>{
                console.log("add table-posts:",res.data.lines);
                alert('Post added!')
                fetchPostsData()
            })
            .catch((err)=>{
                alert("Can't add new post!")
                console.log(err)})
        }
    }

    
    //delete item action
    const handleDeleteAction = (post_id, post_value, user_id)=>{
        axios.post('http://localhost:5000/api/delete-table-posts',{
            post_id:post_id,
            post_value:post_value,
            user_id:user_id
        })
        .then(res=>{
            console.log("delete table-posts:",res.data.lines);
            alert('Delete succesfully!')
            fetchPostsData()
        })
        .catch((err)=>{
            alert("Can't delete post!")
            console.log(err)})


    }
    

    //modify table
    const [newPostVal , setNewPostVal] = useState({
        post_id:'',
        new_post_val:''
    })
    const handleChangeNewPostVal = (e)=>{
        if(e.target.name == 'post_id')
        {
            setNewPostVal((prev)=>{
                return{
                    ...prev,
                    post_id: e.target.value
                }
            })
        }
        else if(e.target.name == 'new_post_val')
        {
            setNewPostVal((prev)=>{
                return{
                    ...prev,
                    new_post_val: e.target.value
                }
            })

        }
    }

    const submitUpdateItem = ()=>{
        if(newPostVal.post_id == '')
        {
            alert('Please select post id')
        }
        else if(newPostVal.new_post_val== '')
        {
            alert("Please complete field post's val")
        }
        else 
        {
            axios.post('http://localhost:5000/api/update-table-posts',{
                post_id: newPostVal.post_id,
                new_post_val: newPostVal.new_post_val
            })
            .then(res=>{
                console.log("update table-posts:",res.data.lines);
                alert('Updated succesfully!')
                fetchPostsData()
            })
            .catch((err)=>{
                alert("Can't update post!")
                console.log(err)})
        }
    }
    return (
        <div className="table-users-container">
            <LeftBar />
            <div className="table-users-content">
                <div className="top-bar-table">
                    <div className="top-bar-current-table">
                        <span>TABLE POSTS</span>
                    </div>
                    <div className="top-bar-log-out">
                        <span>Current userID: {props.currentUser}</span>
                        <button >Log out</button>
                    </div>
                </div>
                
                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Add Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>User_1:</span>
                            <select name="user_1" onChange={handleAddNewItemChange}>
                                {
                                     users.map((el, index)=>{
                                        return (<option value={el.ID}>{el.ID}</option>)
                                     })
                                }
                            </select>
                    </div>
                    <div className="table-add-item-field">
                            <span>User_2(Tag other user):</span>
                            <select name="user_2" onChange={handleAddNewItemChange}>
                                {
                                     users.map((el, index)=>{
                                        return (<option value={el.ID}>{el.ID}</option>)
                                     })
                                }    
                            </select>

                    </div>
                    
                    <div className="table-add-item-field">
                            <span>Post value:</span>
                            <input type="text" name="post-value" onChange={handleAddNewItemChange}/>
                    </div>
                    <div className="table-add-item-submit">
                        <button onClick={submitAddNewPost}>Add into table</button>
                    </div>
                </div>

                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Modify Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>Select post_id:</span>
                            <select name="post_id" onChange={handleChangeNewPostVal}>
                                {
                                     postsData.map((el, index)=>{
                                         if(index %2 == 0)
                                            return (<option value={index}>{index}</option>)
                                     })
                                }
                              
                            </select>
                    </div>
                    <div className="table-add-item-field">
                            <span>Change post val:</span>
                            <input type="text" name="new_post_val" onChange={handleChangeNewPostVal}/>
                    </div>



                    <div className="table-add-item-submit">
                        <button onClick={submitUpdateItem}>Update into table</button>
                    </div>
                </div>

                <div className="table-view-data">
                    <table>
                    <tr>
                        <th>post_id</th>
                        <th>post_value</th>
                        <th>by user_id</th>
                        <th>Delete</th>
                    </tr>
                    <>
                          {
                              postsData.map((el, index)=>{
                                  return (
                                      <tr>
                                          <td>{el.post_id}</td>
                                          <td>{el.post_value}</td>
                                          <td>{el.by_user_id}</td>
                                          <td><img  
                                            className="delete-icon" 
                                            src={TrashIcon} 
                                            alt='del'
                                            onClick={()=>handleDeleteAction(el.post_id, el.post_value, el.by_user_id)}
                                            />
                                          </td>
                                      </tr>
                                  )
                              })
                          }
                    </>
                    </table>

                </div>
            </div>
            
       
        </div>
    )
};

export default TablePosts;
