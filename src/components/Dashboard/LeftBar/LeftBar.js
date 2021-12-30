import React from 'react';
import './LeftBar.css';
import Logo from '../../../media/logo_2.png';
import { useNavigate  } from "react-router-dom";

const LeftBar = ()=>{
    
    const history = useNavigate ()

    const redirect = (to)=>{
        history(`/${to}`)
    }
   
    return(
        <div className="left-bar-container">
            <div className="logo-container">
                <img src={Logo} alt="logo"/>
                <span>magnus</span>
            </div>

            <div 
                className="field-container"
                onClick={()=>redirect('table-users')}
            >
                <span>Table Users</span>
            </div>
            
            
            <div 
                className="field-container"
                onClick={()=>redirect('table-description')}
                >
                <span>Table Description</span>
            </div>   
            <div 
                className="field-container"
                onClick={()=>redirect('table-status')}
                >
                
                <span>Table Status</span>
            </div>           
            <div 
                className="field-container"
                onClick={()=>redirect('table-posts')}
                >
                <span>Table Posts</span>
            </div>           
        </div>
    )
}

export default LeftBar;
