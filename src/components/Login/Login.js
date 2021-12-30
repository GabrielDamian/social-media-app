import React,{useState,useEffect} from 'react';
import './Login.css';
import Logo from '../../media/logo.png';
import { useNavigate  } from "react-router-dom";
import axios from 'axios';


const Login = (pros)=>{

    const [data,setData] = useState({
        username: '',
        password: ''
    });

    const history = useNavigate ()

    const redirect = ()=>{
        history('/signup')
    }

    const handleInputChange = (e)=>{
        if(e.target.name == 'username')
        {
            console.log('user:', e.target.value);
            setData((prev)=>{
                return({
                    ...prev,
                    username: e.target.value
                })
            })
        }
        else if(e.target.name == 'password')
        {
            console.log('pass:', e.target.value)
            setData((prev)=>{
                return{
                    ...prev,
                    password: e.target.value
                }
            })
        }
    }

    const handleSubmit = ()=>{
        if(data.username.length == 0)
        {
            alert('Please complete username field!')
        }
        else if(data.password.length == 0)
        {
            alert('Please complete password field!')
        }
        else{

            
            axios.post('http://localhost:5000/api/login',data)
            .then((res)=>{
                console.log('rasp api login:', res.data)
                localStorage.setItem('token',res.data)
                history('/table-users');

            })
            .catch(error => {
                console.log(error);
                alert('There was a problem logging you in.')
            });

        }
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
                            <input type="text" name="username" onChange={handleInputChange}/>
                        </div>
                        <div className="form-element">
                            <div className="form-elem-label">
                                <span>Password</span>
                            </div>
                            <input type="password" name="password" onChange={handleInputChange}/>
                        </div>
                        <div className="form-button">
                            <button onClick={handleSubmit}>Login</button>
                        </div>
                        <div className="switch-login-signup">
                            <span onClick={redirect} >Switch to signup </span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
export default Login;
