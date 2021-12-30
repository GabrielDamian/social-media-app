import React,{useState,useEffect,useHistory} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';

const TableStatus = () => {


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
            haveAcces == true ? <TableStatusContent logOut={logOut} currentUser={currentUser}/> : <DashboardBlocked/>
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

const TableStatusContent = (props)=>{
    
    const history = useNavigate ()
    const logMeOut = ()=>{
        props.logOut();
        history('/login')
    }
    

    const [tableuserData, setTableUserData] = useState([1,2]);

    const fetchData = ()=>{
        axios.post('http://localhost:5000/api/fetch-table-users',{})
            .then(res=>{
                console.log("fetch table-users:",res.data.lines);
                setTableUserData(res.data.lines)
               
            })
            .catch((err)=>{console.log(err)})
    }

    useEffect(()=>{
        fetchData();
    },[])

    useEffect(()=>{
       console.log('tableuserData update',tableuserData);
    },[tableuserData])

    
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
                            <input type="text" name="username"/>

                    </div>
                    <div className="table-add-item-field">
                            <span>Password</span>
                            <input type="text" name="password_token" />
                    </div>
                    <div className="table-add-item-submit">
                        <button >Add into table</button>
                    </div>
                </div>

                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Modify Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>Select item ID:</span>
                            <select name="id">
                                {
                                    //  tableData.map((el, index)=>{
                                    //     return (<option value={el.ID}>{el.ID}</option>)
                                    //  })
                                }
                              
                            </select>
                    </div>
                    <div className="table-add-item-field">
                            <span>Username</span>
                            <input 
                                type="text" 
                                name="username" 
                                
                            />
                    </div>
                    <div className="table-add-item-field">
                            <span>Password</span>
                            <input 
                                type="text" 
                                name="password_token" 
                               
                                />
                    </div>
                    <div className="table-add-item-submit">
                        <button >Update into table</button>
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
                            //   tableData.map((el, index)=>{
                            //       return (
                            //           <tr>
                            //               <td style={{color:el.ID == props.currentUser? 'red':'blue'}}>{el.ID}</td>
                            //               <td>{el.username}</td>
                            //               <td>{el.password_token}</td>
                            //               <td><img  
                            //                 className="delete-icon" 
                            //                 src={TrashIcon} 
                            //                 alt='del'
                            //                 onClick={()=>handleDeleteAction(el.ID)}
                            //                 />
                            //               </td>
                            //           </tr>
                            //       )
                            //   })
                          }
                    </>
                    </table>

                </div>
            </div>
            
       
        </div>
    )
};


export default TableStatus;
