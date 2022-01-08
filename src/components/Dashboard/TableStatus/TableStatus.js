import React,{useState,useEffect,useHistory} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';
import TrashIcon from '../../../media/trash-bin.png';
import PageBlocked from '../PageBlocked/PageBlocked';

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
            haveAcces == true ? <TableStatusContent logOut={logOut} currentUser={currentUser}/> : <PageBlocked/>
        }
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


    const [statusData, setStatusData] =useState([]);

    const fetchStatusData = ()=>{
        axios.post('http://localhost:5000/api/fetch-table-status',{})
        .then(res=>{
            console.log("fetch table-status:",res.data.lines);
            setStatusData(res.data.lines);
        })
        .catch((err)=>{console.log(err)})
    }
    useEffect(()=>{
        fetchStatusData()

    },[])
    useEffect(()=>{
        console.log('STATUS DATA:', statusData)
    },[statusData])

    const deleteAction = (id,status_value)=>{
        axios.post('http://localhost:5000/api/delete-table-status',{
            user_id: id,
            status_val: status_value
        })
        .then(res=>{
            alert('Status deleted!')
            fetchStatusData()
        })
        .catch((err)=>{
            console.log(err)
            alert("Can't delete status!")
        })

    }
    const listaOptiuniCheck =['BadKarma','DogeCoin','Buttercup','PickleRick']

    const [addUserData, setAddUserData] = useState({
        user_id:'',
        status_value:''
    })
    const handleAddUserChange = (e)=>{
        if(e.target.name == 'user_id')
        {
            setAddUserData((prev)=>{
                return{
                    ...prev,
                    user_id: e.target.value
                }
            })
        }
        else if(e.target.name == 'status_value')
        {
            setAddUserData((prev)=>{
                return{
                    ...prev,
                    status_value: e.target.value
                }
            })
        }
    }
    const submitAddUser = ()=>{
        if(addUserData.user_id == '')
        {
            alert('please compelte user_id field')
        }
        else if(addUserData.status_value == '')
        {
            alert('please complete status value field')
        }
        else
        {
   
            //verifica daca userul are deja acel status value

            let existaDeja = false
            statusData.forEach((el)=>{
                if(el.user_id == addUserData.user_id && el.status_value == addUserData.status_value)
                {
                    alert(`userul ${el.user_id} are deja status value de ${el.status_value} `)
                    existaDeja = true
                }

            })
            if(existaDeja == false)
            {
                //fetch la api si adauga user
                console.log('fetch la api si adauga user')
                axios.post('http://localhost:5000/api/insert-item-status',{
                    user_id: addUserData.user_id,
                    status_val: addUserData.status_value
                })
                .then(res=>{
                    alert('Status added successfully!')
                    fetchStatusData()
                })
                .catch((err)=>{
                    console.log(err)
                    alert("Can't add status!")
                })
                
            }
        }
     
    }


    //modify item section
    const [modifyValue, setModifyValue] = useState({
        user_id: '',
        status_val: '',
        old_val: ''
    })
    const handleModifyValCahnge = (e)=>{
        //status_val
        //user_id
        if(e.target.name == 'user_id')
        {
            setModifyValue((prev)=>{
                return{
                    user_id: statusData[e.target.value].user_id,
                    status_val: statusData[e.target.value].status_value,
                    old_val: statusData[e.target.value].status_value
                }
            })
        }
        else if(e.target.name == 'status_val' )
        {
            setModifyValue((prev)=>{
                return{
                    ...prev,
                    status_val: e.target.value
                }
            })
        }
    }

    const handleModifyItemTrigger = ()=>{
        if(modifyValue.user_id == '')
        {
            alert('please select a temp index')
        }
        else if(modifyValue.status_val == '')
        {
            alert("status value field can't be empty")
        }
        else if(modifyValue.status_val == modifyValue.old_val)
        {
            alert("New value is the cannot be the same as the old value!")
        }
        else
        {

            console.log("Status data:", statusData)
            let user_id = modifyValue.user_id;
            let new_status_val = modifyValue.status_val;

            let user_already_have_this_status = false;
            statusData.forEach((el)=>{
                if(el.user_id == user_id && el.status_value == new_status_val)
                {
                    user_already_have_this_status = true
                }
            })

            if(user_already_have_this_status)
            {
                alert("This user already have this status in another row! Cannot add it anymore.")
            }
            else 
            {
                     //fetch la api cu update
                    axios.post('http://localhost:5000/api/update-item-status',{
                        user_id: modifyValue.user_id,
                        new_status_val: modifyValue.status_val,
                        old_status_val: modifyValue.old_val
                    })
                    .then(res=>{
                        alert('Status updated!')
                        fetchStatusData()
                    })
                    .catch((err)=>{
                        console.log(err)
                        alert("Can't update status!")
                    })
            }
                  
        }
    }

    useEffect(()=>{
        console.log("modifyValue uopdate:", modifyValue)
    },[modifyValue])
    return(
        <div className="table-users-container">
            <LeftBar />
            <div className="table-users-content">
                <div className="top-bar-table">
                    <div className="top-bar-current-table">
                        <span>TABLE STATUS</span>
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
                            <span>User_id</span>
                            <select name="user_id" onChange={handleAddUserChange}>
                                {
                                     tableuserData.map((el, index)=>{
                                        return (<option value={el.ID}>{el.ID}</option>)
                                     })
                                }
                              
                            </select>

                    </div>
                    
                    <div className="table-add-item-field">
                            <span>Status value</span>
                            <select name="status_value" onChange={handleAddUserChange}>
                                {
                                     listaOptiuniCheck.map((el, index)=>{
                                        return (<option value={el}>{el}</option>)
                                     })
                                }
                              
                            </select>
                    </div>
                    <div className="table-add-item-submit">
                        <button onClick={submitAddUser}>Add into table</button>
                    </div>
                </div>

                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Modify Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>Select temp index:</span>
                            <select name="user_id" onChange={handleModifyValCahnge}>
                                {
                                     statusData.map((el, index)=>{
                                        return (<option value={index}>{index}</option>)
                                     })
                                }
                              
                            </select>
                    </div>
                    <div className="table-add-item-field">
                            <span>Selected user_id:</span>
                            <span>{modifyValue.user_id}</span>
                    </div>
                    <div className="table-add-item-field">
                            <span>Status value:</span>
                            
                             <select name="status_val" value={modifyValue.status_val} onChange={handleModifyValCahnge}>
                                {
                                     listaOptiuniCheck.map((el, index)=>{
                                        return (<option value={el}>{el}</option>)
                                     })
                                }
                              
                            </select>
                    </div>


                    <div className="table-add-item-submit">
                        <button onClick={handleModifyItemTrigger}>Update into table</button>
                    </div>
                </div>

                <div className="table-view-data">
                    <table>
                    <tr>
                        <th>temp index</th>
                        <th>User_id</th>
                        <th>Status Value</th>
                        <th>Delete</th>
                    </tr>
                    <>
                          {
                              statusData.map((el, index)=>{
                                  return (
                                      <tr>
                                          <td>{index}</td>
                                          <td style={{color:el.user_id == props.currentUser? 'red':'blue'}}>{el.user_id}</td>
                                          <td>{el.status_value}</td>
                                          <td><img  
                                            className="delete-icon" 
                                            src={TrashIcon} 
                                            alt='del'
                                            onClick={()=>deleteAction(el.user_id, el.status_value)}
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


export default TableStatus;
