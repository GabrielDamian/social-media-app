import React from 'react';
import './Denied.css';
import DeniedIcon from '../../media/denied.png';

const Denied = (props)=>{
    return (
        <div className="denied-container">
            <img src={DeniedIcon} alt="denied"/>
            <span>You don't have acces to this page.</span>
        </div>
    )
}

export default Denied;
