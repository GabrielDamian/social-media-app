import React from 'react';
import './Denied.css';
import DeniedIcon from '../../media/denied.png';

import { useNavigate  } from "react-router-dom";

const Denied = (props)=>{
    const history = useNavigate ()
    const redirectLogin = ()=>{
        history('/login')
    }
    return (
        <div className="denied-container">
            <img src={DeniedIcon} alt="denied"/>
            <span>You don't have acces to this page.</span>
            <button onClick={redirectLogin}>Login</button>
        </div>
    )
}

export default Denied;
