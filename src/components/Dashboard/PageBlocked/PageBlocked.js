import React from 'react';
import { useNavigate  } from "react-router-dom";
import './PageBlocked.css';

const PageBlocked = ()=>{
    const history = useNavigate ()

    const redirect = ()=>{
        history('/login')
    }
    return(
        <div className="page-blocked-container">
            <p>You must be logged in to access this page.</p>
            <br/>
            <button onClick={redirect}>Log in</button>
        </div>
    )
}

export default PageBlocked