import React from 'react';
import './Login.css';
import Logo from '../../media/logo.png';
import { useNavigate  } from "react-router-dom";


const Login = (pros)=>{
    const history = useNavigate ()

    const redirect = ()=>{
        history('/signup')
    }
    return (
        <div className="login-container">
            <div className="left-container">
                <img src={Logo} alt="logo"/>
            </div>
            <div className="right-container">
                <div className="form-container">
                    <div className="form-title">
                        <span>Login</span>
                    </div>
                    <div className="fake-border"/>
                    <div className="form-content">
                        <div className="form-element">
                            <div className="form-elem-label">
                                <span>Username</span>
                            </div>
                            <input type="text"/>
                        </div>
                        <div className="form-element">
                            <div className="form-elem-label">
                                <span>Password</span>
                            </div>
                            <input type="password"/>
                        </div>
                        <div className="form-button">
                            <button>Login</button>
                        </div>
                        <div className="switch-login-signup">
                            <span onClick={redirect}>Switch to signup </span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
export default Login;
