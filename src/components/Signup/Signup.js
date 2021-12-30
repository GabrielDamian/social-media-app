import React from 'react';
import {useState, useEffect} from 'react';
import './Signup.css';
import Logo from '../../media/logo.png';
import { useNavigate  } from "react-router-dom";
import axios from 'axios';


const Signup = (props)=>{
    const history = useNavigate ()

    const redirect = ()=>{
        history('/login')
    }
    const [data, setData] = useState({
        username: '',
        password: '',
        repeatpassword: ''
    })
    const handleChange = (e)=>{
        console.log(e.target.value,e.target.name);
        if(e.target.name == 'username')
        {
            setData((prev)=>{
                return{
                    ...prev,
                    username: e.target.value
                }
            })
        }
        else if (e.target.name == 'password')
        {
            setData((prev)=>{
                return{
                    ...prev,
                    password: e.target.value
                }
            })
        }
        else if (e.target.name == 'repeatpassword')
        {
            setData((prev)=>{
                return{
                    ...prev,
                    repeatpassword: e.target.value
                }
            })
        }
    }
    const handleSubmit = ()=>{
        if (data.username == '')
        {
            alert('Please complemet username first!')
        }
        else if (data.password == '' || data.repeatpassword == '')
        {
            alert('Please complete both password!')
        }
        else if (data.password != data.repeatpassword)
        {
            alert("Passwords don't match!")
        }
        else if (data.password.length <5)
        {
            alert("Password to short! (min 5 length)")
        }
        else 
        {
            console.log("Sign up la api!")
            axios.post('http://localhost:5000/api/signup',data)
            .then((resp)=>{
                alert('Welcome!')
                console.log('resp:',resp.data)
                localStorage.setItem('token',resp.data)
                history('/table-users')
                
            })
            .catch((err)=>{
                alert('Unable to signup!')
            })
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
                    <span>Signup</span>
                </div>
                <div className="fake-border"/>
                <div className="form-content">
                    <div className="form-element">
                        <div className="form-elem-label">
                            <span>Username</span>
                        </div>
                        <input type="text" name='username' value={data.username} onChange={handleChange}/>
                    </div>
                    <div className="form-element">
                        <div className="form-elem-label">
                            <span>Password</span>
                        </div>
                        <input type="password" name="password" value={data.password} onChange={handleChange}/>
                    </div>
                    <div className="form-element">
                        <div className="form-elem-label">
                            <span>Repeat password</span>
                        </div>
                        <input type="password" name="repeatpassword" value={data.repeatpassword} onChange={handleChange}/>
                    </div>
                    <div className="form-button">
                        <button onClick={handleSubmit}>Signup</button>
                    </div>
                    <div className="switch-login-signup">
                            <span onClick={redirect}>Switch to login </span>
                        </div>
                </div>

            </div>

        </div>
    </div>
    )
}
export default Signup;
