import React,{useState,useEffect,useHistory} from 'react';
import axios from 'axios';
import { useNavigate  } from "react-router-dom";
import store from '../../../redux/store';
import LeftBar from '../LeftBar/LeftBar';
import './TableDescription.css';
import TrashIcon from '../../../media/trash-bin.png';
import PageBlocked from '../PageBlocked/PageBlocked';

const TableDescription = () => {


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
            haveAcces == true ? <TableDescriptionContent logOut={logOut} currentUser={currentUser}/> : <PageBlocked/>
        }
        </>
    )
}

const TableDescriptionContent = (props)=>{

    const history = useNavigate ()
    const logMeOut = ()=>{
        props.logOut();
        history('/login')
    }

    const [tableData, setTableData] = useState([1,2]);

    const fetchData = ()=>{
        console.log('in fetch')
        axios.post('http://localhost:5000/api/fetch-table-desc',{})
            .then(res=>{
                console.log("fetch-table-desc:",res.data.lines);
                setTableData(res.data.lines)
               
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    useEffect(()=>{
        fetchData();

    },[])

   
    const handleDeleteAction = (id)=>{
        
            const config ={
                id: id,
            }
    
            axios.post('http://localhost:5000/api/delete-item-desc',config)
                .then((resp)=>{
                    alert('Description deleted succesefully!!')
                    console.log('resp:',resp.data)
                    fetchData();
                    
                })
                .catch((err)=>{
                    alert('Unable to delete!')
                })
    }
    
    const [selectedModifyUser, setSelectedModifyUser] = useState({
        user_id: '',
        description_val: ''
    })



    const handleModifyItem = (e)=>{
        console.log('aici')
        console.log(e.target.name, e.target.value)
        if(e.target.name == 'user_id')
        {
                console.log('user_id case')
                let auto_desc = ''
                //pentru id selectat, vr sa auto completez celelalte campuri
                tableData.forEach((el)=>{
                    if(el.user_id == e.target.value)
                    {
                        auto_desc = el.description_val
                        
                    }
                })
                
                
                setSelectedModifyUser((prev)=>{
                    return{
                        ...prev,
                        user_id: e.target.value,
                        description_val: auto_desc
                    }
                })
        }
        else  if(e.target.name == 'desc_val')
        {
            setSelectedModifyUser((prev)=>{
                return{
                    ...prev,
                    description_val: e.target.value
                }
            })
        }
        
        
    }


    const modifyItem = () =>
    {

        const config = {
           user_id: selectedModifyUser.user_id,
           desc_val: selectedModifyUser.description_val
        }


        axios.post('http://localhost:5000/api/update-item-desc',config)
        .then((resp)=>{
            alert('Description updated succesfully!')
            console.log('resp:',resp.data)
            fetchData();
            
        })
        .catch((err)=>{
            alert('Unable to update!')
        })
      
    }


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

    const [insertNew, setInsertNew] = useState({
        user_id: '',
        desc_val: ''
    })

    const handleNewInputChange = (e)=>{
        console.log('handleNewInputChange')

        if(e.target.name == 'user_id')
        {
                setInsertNew((prev)=>{
                    return{
                        ...prev,
                        user_id: e.target.value
                    }
                })
        }
        else if(e.target.name == 'desc_val')
        {
            setInsertNew((prev)=>{
                return{
                    ...prev,
                    desc_val: e.target.value
                }
            })
        }   
    }

    const insertNewTriggger = ()=>{
        console.log('insertNewTriggger')

        if(insertNew.user_id == '')
        {
            alert('Please select a wich user')
        }
        else if (insertNew.desc_val == '')
        {
            alert('Please select a description value')
        }
        else
        {
            //verifica daca userul respectiv are deja o descriere
            let alreadyExits = false
            tableData.forEach((el)=>{
                if(el.user_id == insertNew.user_id)
                {
                    alreadyExits = true
                    alert('This user have already a desc, please delete it or select another user')
                }
            })
            if(alreadyExits == false)
            {
                console.log('alreadyExits=', alreadyExits)
                //aici se poate face insert into desc table
                axios.post('http://localhost:5000/api/insert-item-desc',{
                    user_id: insertNew.user_id,
                    desc_val: insertNew.desc_val
                })
                .then(res=>{
                    console.log("fetch table-users:",res.data.lines);
                    alert('Succes adding description')
                    fetchData()
                })
                .catch((err)=>{console.log(err)})
            }
        }
    }
    return(
        <div className="table-users-container">
            <LeftBar />
            <div className="table-users-content">
                <div className="top-bar-table">
                    <div className="top-bar-current-table">
                        <span>TABLE DESCRIPTION</span>
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
                            <span>Wich user:</span>
                            <select onChange={handleNewInputChange} name="user_id">
                                {
                                     users.map((el, index)=>{
                                        return (<option value={el.ID}>{el.ID}</option>)
                                     })
                                }
                              
                            </select>

                    </div>
                    <div className="table-add-item-field">
                            <span>Desc val</span>
                            <input onChange={handleNewInputChange} name="desc_val" />
                    </div>
                    <div className="table-add-item-submit">
                        <button onClick={insertNewTriggger}>Add into table</button>
                    </div>
                </div>

                <div className="table-add-item">
                    <div className="table-title-meaning">
                        Modify Item:
                    </div>
                    <div className="table-add-item-field">
                            <span>Select user_id:</span>
                            <select name="user_id" onChange={handleModifyItem}>
                                {
                                     tableData.map((el, index)=>{
                                        return (<option value={el.ID}>{el.user_id}</option>)
                                     })
                                }
                              
                            </select>
                    </div>
                    <div className="table-add-item-field">
                            <span>Desc_val</span>
                            <input 
                                type="text" 
                                name="desc_val" 
                                onChange={handleModifyItem}
                                value={selectedModifyUser.description_val}    
                            />
                    </div>
                  
                    <div className="table-add-item-submit">
                        <button onClick={modifyItem}>Update into table</button>
                    </div>
                </div>

                <div className="table-view-data">
                    <table>
                    <tr>
                        <th>User_id (FK id from users)</th>
                        <th>Description</th>
                        <th>Delete</th>

                    </tr>
                    <>
                          {
                              tableData.map((el, index)=>{
                                  return (
                                      <tr>
                                          <td>{el.user_id}</td>
                                          <td>{el.description_val}</td>
                                          <td><img  
                                            className="delete-icon" 
                                            src={TrashIcon} 
                                            alt='del'
                                            onClick={()=>handleDeleteAction(el.user_id)}
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
export default TableDescription;
