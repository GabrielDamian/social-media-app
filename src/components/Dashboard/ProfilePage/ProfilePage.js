import React,{useState,useEffect,useHistory} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';
import './ProfilePage.css';
import AvatarImg from '../../../media/avatar.png';
import PageBlocked from '../PageBlocked/PageBlocked';

const ProfilePage = () => {


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
            haveAcces == true ? <ProfilePageContent logOut={logOut} currentUser={currentUser}/> : <PageBlocked/>
        }
        </>
    )
}


const ProfilePageContent = (props)=>{

    //get username by id  props.currentUser
    const [userData, setUserData] = useState({
        username:'',
        desc:'',
        status:''
    });
    const fetchUsername = ()=>{
        axios.post('http://localhost:5000/api/fetch-specific-userame',{
            id: props.currentUser
        })
        .then(res=>{
                console.log(res.data)

                setUserData((prev)=>{
                    return{
                        ...prev,
                        username:res.data.username
                    }
                })
            })
        .catch((err)=>{
            console.log(err)
            alert("Can't fetch user's profile page data!")
        })
    }

    useEffect(()=>{
        fetchUsername();
    },[])

    const fetchDescription = ()=>{

        axios.post('http://localhost:5000/api/fetch-specific-description',{
            id: props.currentUser
        })
        .then(res=>{
            
                console.log("fetch descccc:", res.data)
                setUserData((prev)=>{
                    return{
                        ...prev,
                        desc: res.data.desc
                    }
                })
            })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        fetchDescription()
    },[])

    const fetchStatus = ()=>{
        axios.post('http://localhost:5000/api/fetch-specific-status',{
            id: props.currentUser
        })
        .then(res=>{
            
                console.log("fetch descccc:", res.data)
                setUserData((prev)=>{
                    return{
                        ...prev,
                        status: res.data.status
                    }
                })
            })
        .catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        fetchStatus()
    },[])

    useEffect(()=>{
        console.log("userData update:",userData)
    },[userData])



    const listaOptiuniCheck =['BadKarma','DogeCoin','Buttercup','PickleRick']

    //submit new user data
    const [newData, setNewData] = useState({
        newDesc:'',
        newStatus:''
    })

    const handleNewDataChange = (e)=>{
        if(e.target.name == 'desc')
        {
            setNewData((prev)=>{
                return{
                    ...prev,
                    newDesc: e.target.value
                }
            })
        }
        else if(e.target.name == 'status')
        {
            setNewData((prev)=>{
                return{
                    ...prev,
                    newStatus: e.target.value
                }
            })

        }
    }

    useEffect(()=>{
        console.log("newData update:", newData);

    },[newData])

    const submitDescription = ()=>{
        console.log('submitDescription')

        if(newData.newDesc == '')
        {
            alert('please compelte desc field')
        }
        else 
        {
            //verfica prin userData daca exista deja desc sau creeaza una noua
            if(userData.desc == '')
            {
                //userul nu are o descriere, trebuie insert new 
                
                axios.post('http://localhost:5000/api/insert-item-desc',{
                    user_id: props.currentUser,
                    desc_val: newData.newDesc
                })
                .then(res=>{
                    
                        console.log("fetch descccc:", res.data)
                        fetchDescription()
                    })
                .catch((err)=>{
                    console.log(err)
                    alert("Can't insert user's desctiption!")
                })


            }
            else 
            {
                //userul are deja o descriere 
                axios.post('http://localhost:5000/api/update-item-desc',{
                    user_id: props.currentUser,
                    desc_val: newData.newDesc
                })
                .then(res=>{
                    
                        console.log("fetch descccc:", res.data)
                        fetchDescription()
                    })
                .catch((err)=>{
                    console.log(err)
                    alert("Can't update user's desctiption!")
                })
            }
        }
    }
    const submitStatus = ()=>{
        console.log('submit status')
        if(newData.status == '')
        {
            alert('plase complete status field')
        }
        else 
        {
            //verfica prin status daca exista deja desc sau creeaza una noua
            if(userData.status == '')
            {
                //userul nu are o descriere, trebuie insert new 
                axios.post('http://localhost:5000/api/insert-item-status',{
                    user_id: props.currentUser,
                    status_val: newData.newStatus
                })
                .then(res=>{
                    
                        console.log("fetch descccc:", res.data)
                        fetchStatus()
                    })
                .catch((err)=>{
                    console.log(err)
                    alert("Can't insert user's status!")
                })
            }
            else 
            {
                //userul are deja 
                 //userul nu are o descriere, trebuie insert new 
                 axios.post('http://localhost:5000/api/update-item-status',{
                    user_id: props.currentUser,
                    new_status_val: newData.newStatus,
                    old_status_val: userData.status
                })
                .then(res=>{
                    
                        console.log("fetch descccc:", res.data)
                        fetchStatus()
                    })
                .catch((err)=>{
                    console.log(err)
                    alert("Can't update user's status!")
                })
            }
        }
    }
    return(
        <div className="profile-page-container">
            <LeftBar/>
            <div className="profile-page-content">
                <div className="profile-page-header">
                    <span>Profile Page</span>
                </div>
                <div className="profile-page-avatar">
                   <div className="profile-page-avatar-top">
                       <img src={AvatarImg} alt="avatar"/>
                    </div>
                    <div className="profile-page-avatar-bottom">
                        <span>User id: {props.currentUser}</span>
                        <br/>
                        <span>Username: {userData.username}</span>
                    </div>
                    <div className="separator-bottom"/>
                    <div className="item-specific-profile">
                        <div className="item-spefic-profile-left">
                            <div className="item-spefic-profile-left-header">
                                <span>Description:</span>
                            </div>
                            <div className="item-spefic-profile-left-bottom">
                                <span>{userData.desc}</span>
                            </div>
                        </div>

                        <div className="item-spefic-profile-right">
                            <input type="text" name='desc' onChange={handleNewDataChange}/>
                            <button onClick={submitDescription}>Submit description</button>
                        </div>
                    </div>
                    <div className="item-specific-profile">
                    <div className="item-spefic-profile-left">
                            <div className="item-spefic-profile-left-header">
                                <span>Status:</span>
                            </div>
                            <div className="item-spefic-profile-left-bottom">
                                <span>{userData.status}</span>
                            </div>
                        </div>

                        <div className="item-spefic-profile-right">
                            <select onChange={handleNewDataChange} name='status'>
                                {
                                    listaOptiuniCheck.map((el)=>{
                                        return (<option value={el}>{el}</option>)
                                    })
                                }
                            </select>
                            <button onClick={submitStatus}>Submit status</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;
