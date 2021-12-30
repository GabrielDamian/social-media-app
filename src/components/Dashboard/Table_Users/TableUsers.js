import React,{useState,useEffect,useHistory} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';
import './TableUsers.css';

const TableUsers = () => {


    const [haveAcces, setHaveAcces] = useState(false);

    useEffect(()=>{
        store.subscribe(()=>{
            // console.log("store updated!:",store.getState())
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
            haveAcces == true ? <TableUsersContent logOut={logOut}/> : <DashboardBlocked/>
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




    return(
        <div className="table-users-container">
            <LeftBar />
            <div className="table-users-content">
                <div className="top-bar-table">
                    <div className="top-bar-current-table">
                        <span>TABLE USERS</span>
                    </div>
                    <div className="top-bar-log-out">
                        <button onClick={logMeOut}>Log out</button>
                    </div>
                </div>
                
                <div className="table-add-item">
                    <div className="table-add-item-field">

                    </div>
                    <div className="table-add-item-field">
                        
                    </div>
                    
                </div>
                <div className="table-view-data">
                    <table>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Password Token</th>
                    </tr>
                    <>
                          {
                              tableData.map((el, index)=>{
                                  return (
                                      <tr>
                                          <td>{el.ID}</td>
                                          <td>{el.username}</td>
                                          <td>{el.password_token}</td>
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
