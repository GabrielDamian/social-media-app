import React,{useState,useEffect,useHistory} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';
import './TableUsers.css';
import TrashIcon from '../../../media/trash-bin.png';

const TableUsers = () => {


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
            .catch((err)=>{console.log(err)})
    })

    
    const logOut = ()=>{
        localStorage.clear();
    }
    return (
        <>
        {
            haveAcces == true ? <TableUsersContent logOut={logOut} currentUser={currentUser}/> : <DashboardBlocked/>
        }
        </>
    )
}

const DashboardBlocked = ()=>{
    const history = useNavigate ()

    const redirect = ()=>{
        history('/login')
    }
    return(
        <>
            <p>Do you know the way ?</p>
            <button onClick={redirect}>Log in</button>
        </>
    )
}

const TableUsersContent = (props)=>{

    const history = useNavigate ()
    const logMeOut = ()=>{
        props.logOut();
        history('/login')
    }

    const [tableData, setTableData] = useState([1,2]);

    const fetchData = ()=>{
        axios.post('http://localhost:5000/api/fetch-table-users',{})
            .then(res=>{
                console.log("fetch table-users:",res.data.lines);
                setTableData(res.data.lines)
               
            })
            .catch((err)=>{console.log(err)})
    }

    useEffect(()=>{
        console.log('use effect')
        fetchData();

    },[])
    useEffect(()=>{
        
        console.log('tableData updated')
        console.log(tableData)
        

    },[tableData])




    const [inputData, setInputData] = useState({
        username: '',
        password_token: ''
    })
    const handleInputChange= (e)=>{
        if(e.target.name == 'username')
        {
            console.log('usernme:', e.target.value);

            setInputData((prev)=>{
                
                return{
                    ...prev,
                    username: e.target.value
                }
            }) 
        }
        else if(e.target.name == 'password_token')
        {
            console.log('pass:', e.target.value);

            setInputData((prev)=>{
                return{
                    ...prev,
                    password_token: e.target.value
                }
            }) 
        }
    }

    const handleSubmit = ()=>{
        if (inputData.username == '')
        {
            alert('Please complemet username first!')
        }
        else if (inputData.password_token == '' )
        {
            alert('Please complete  password!')
        }
        else if (inputData.password_token.length <5)
        {
            alert("Password to short! (min 5 length)")
        }
        else 
        {
            console.log("Sign up la api!")
            const config = {
                username: inputData.username,
                password: inputData.password_token,
            }
            axios.post('http://localhost:5000/api/signup',config)
            .then((resp)=>{
                alert('Welcome!')
                console.log('resp:',resp.data)
                fetchData();
                
            })
            .catch((err)=>{
                alert('Unable to signup!')
            })
        }
    }




   
    const handleDeleteAction = (id)=>{
        if(id == props.currentUser)
        {
            alert("You can't delete yourself!")
        }
        else
        {
            const config ={
                id: id,
                table: 'users'
            }
            console.log('cofig:', config);
    
            axios.post('http://localhost:5000/api/delete-item',config)
                .then((resp)=>{
                    alert('Delete succesefully!!')
                    console.log('resp:',resp.data)
                    fetchData();
                    
                })
                .catch((err)=>{
                    alert('Unable to signup!')
                })
        }
      
    }
    
    const [selectedModifyUser, setSelectedModifyUser] = useState({
        id: '',
        username:'',
        password: ''
    })




    const handleModifyItem = (e)=>{
        console.log('aici')
        console.log(e.target.name, e.target.value)
        if(e.target.name == 'id')
        {
                console.log('id case')
                let auto_username = ''
                let auto_password = ''
                //pentru id selectat, vr sa auto completez celelalte campuri
                tableData.forEach((el)=>{
                    if(el.ID == e.target.value)
                    {
                        auto_username = el.username
                        auto_password = el.password_token
                    }
                })
                
                
                setSelectedModifyUser((prev)=>{
                    return{
                        ...prev,
                        id: e.target.value,
                        username: auto_username,
                        password: auto_password
                    }
                })
        }
        else if(e.target.name == 'username')
        {
            console.log('username case')
                setSelectedModifyUser((prev)=>{
                    return{
                        ...prev,
                        username: e.target.value
                    }
                })
        }
        else if(e.target.name == 'password_token')
        {
            console.log('password_token case')
                setSelectedModifyUser((prev)=>{
                    return{
                        ...prev,
                        password: e.target.value
                    }
                })
        }
    }


    const modifyItem = (itemID) =>
    {
        if(selectedModifyUser.id == store.getState().userID)
        {
            alert("You can't alter yourself!");
        }
        else
        {
            console.log('modofy item trigger final')
            const config = {
                id: selectedModifyUser.id,
                username: selectedModifyUser.username,
                password: selectedModifyUser.password,
            }
    
            console.log('check config', config);
    
            axios.post('http://localhost:5000/api/update-item-users',config)
            .then((resp)=>{
                alert('User updated succesfully!')
                console.log('resp:',resp.data)
                fetchData();
                
            })
            .catch((err)=>{
                alert('Unable to update!')
            })
        }
      
    }

    return(
        <div className="table-users-container">
            <LeftBar />
            <div className="table-users-content">
                <div className="top-bar-table">
                    <div className="top-bar-current-table">
                        <span>TABLE USERS</span>
                    </div>
                    <div className="top-bar-log-out">
                        <span>Current userID: {props.currentUser}</span>
                        <button onClick={logMeOut}>Log out</button>
                    </div>
                </div>
                
                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Add Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>Username</span>
                            <input type="text" name="username" onChange={handleInputChange} />

                    </div>
                    <div className="table-add-item-field">
                            <span>Password</span>
                            <input type="text" name="password_token" onChange={handleInputChange}/>
                    </div>
                    <div className="table-add-item-submit">
                        <button onClick={handleSubmit}>Add into table</button>
                    </div>
                </div>

                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Modify Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>Select item ID:</span>
                            <select name="id" onChange={handleModifyItem}>
                                {
                                     tableData.map((el, index)=>{
                                        return (<option value={el.ID}>{el.ID}</option>)
                                     })
                                }
                              
                            </select>
                    </div>
                    <div className="table-add-item-field">
                            <span>Username</span>
                            <input 
                                type="text" 
                                name="username" 
                                onChange={handleModifyItem}
                                value={selectedModifyUser.username}    
                            />
                    </div>
                    <div className="table-add-item-field">
                            <span>Password</span>
                            <input 
                                type="text" 
                                name="password_token" 
                                onChange={handleModifyItem}
                                value={selectedModifyUser.password} 
                                />
                    </div>
                    <div className="table-add-item-submit">
                        <button onClick={modifyItem}>Update into table</button>
                    </div>
                </div>

                <div className="table-view-data">
                    <table>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Password Token</th>
                        <th>Delete</th>
                    </tr>
                    <>
                          {
                              tableData.map((el, index)=>{
                                  return (
                                      <tr>
                                          <td style={{color:el.ID == props.currentUser? 'red':'blue'}}>{el.ID}</td>
                                          <td>{el.username}</td>
                                          <td>{el.password_token}</td>
                                          <td><img  
                                            className="delete-icon" 
                                            src={TrashIcon} 
                                            alt='del'
                                            onClick={()=>handleDeleteAction(el.ID)}
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
}
export default TableUsers;
