import React, { useState } from "react"
import jwt_decode from "jwt-decode"
import { Link, useNavigate } from "react-router-dom"
import { loginUser } from "../../services/parentServices"
import { useDispatch } from "react-redux"
import {
    updateUserDetails
} from "../../actions/index"
import { 
    useToast, 
    useUserLogin
} from "../../context/index"
import {
    AiOutlineEye,
    AiOutlineEyeInvisible
} from "../../assets/react-icons"
import "./UserAuth.css"

function Login()
{
    const dispatch = useDispatch()
    const { setUserLoggedIn } = useUserLogin()
    const { showToast } = useToast()

    const [userEmail    , setUserEmail]    = useState('')
    const [userPassword , setUserPassword] = useState('')
    const [newPasswordType, setNewPasswordType] = useState('password')

    const navigate = useNavigate()

    function toggleNewPasswordAppearance()
    {
      if(newPasswordType==="password")
      {
        setNewPasswordType("text")
      }
      else
      {
        setNewPasswordType("password")
      }
    }

    function loginUserHandler(event)
    {
        event.preventDefault();

        loginUser({userEmail,userPassword})
        .then(res => {
            if(res.data.user)
            {
                localStorage.setItem('socialzone-user-token',res.data.user)
                let loggedInUserDetails = jwt_decode(res.data.user)
                let updatedUserDetails = {
                    loggedInUserId: loggedInUserDetails._id,
                    loggedInUserName: loggedInUserDetails.name, 
                    loggedInUserEmail: loggedInUserDetails.email, 
                    loggedInUserProfile: loggedInUserDetails.userProfilePic,
                    loggedInUserFollowing: res.data.userDetails.following
                }
            
                dispatch(updateUserDetails(updatedUserDetails))
                showToast("success","Logged in successfully")
                setUserLoggedIn(true)
                navigate('/')
            }
            else
            {
                throw new Error("Error in user login")
            }
        })
        .catch(err=>{
            showToast("error","Error logging in user. Please try again")
        })
    }

    function loginGuestUser(event, guestUserNumber)
    {
        event.preventDefault();
        let guestUserEmail = guestUserNumber===1?'rahul.sharma@gmail.com':'priya.patel@gmail.com';
        let guestUserPassword = 'Zxcv123*';

        loginUser({userEmail: guestUserEmail,userPassword: guestUserPassword})
        .then(res => {
            if(res.data.user)
            {
                localStorage.setItem('socialzone-user-token',res.data.user)
                let loggedInUserDetails = jwt_decode(res.data.user)
                let updatedUserDetails = {
                    loggedInUserId: loggedInUserDetails._id,
                    loggedInUserName: loggedInUserDetails.name, 
                    loggedInUserEmail: loggedInUserDetails.email, 
                    loggedInUserProfile: loggedInUserDetails.userProfilePic,
                    loggedInUserFollowing: res.data.userDetails.following
                }
            
                dispatch(updateUserDetails(updatedUserDetails))
                showToast("success","Logged in successfully")
                setUserLoggedIn(true)
                navigate('/')
            }
            else
            {
                throw new Error("Error in user login")
            }
        })
        .catch(err=>{
            showToast("error","Error logging in user. Please try again")
        })
    }

    return (
        <div className="user-auth-page">
        <div className="user-auth-content-container">
            <form onSubmit={loginUserHandler} className="user-auth-form">
                <h2>Login</h2>
                
                <div className="user-auth-input-container">
                    <label htmlFor="user-auth-input-email"><h4>Email address</h4></label>
                    <input 
                        id="user-auth-input-email" 
                        className="user-auth-form-input" 
                        type="email" 
                        placeholder="Email" 
                        value={userEmail}
                        onChange={(event)=>setUserEmail(event.target.value)}
                        required/>
                </div>

                <div className="user-auth-input-container">
                    <label htmlFor="user-auth-input-password"><h4>Password</h4></label>
                    <div className="password-field-container">
                        <input 
                            id="user-auth-input-password" 
                            className="user-auth-form-input" 
                            type={newPasswordType} 
                            placeholder="Password" 
                            value={userPassword}
                            onChange={(event)=>setUserPassword(event.target.value)}
                            required
                        />
                        {
                            (newPasswordType==="text") ?
                            (<AiOutlineEye onClick={toggleNewPasswordAppearance} size="2em" style={{cursor:'pointer'}}/>)
                            :
                            (<AiOutlineEyeInvisible onClick={toggleNewPasswordAppearance} size="2em" style={{cursor:'pointer'}}/>)
                        }
                    </div>
                </div>

                <div className="user-options-container">
                    <div className="remember-me-container">
                        <input type="checkbox" id="remember-me"/>
                        <label htmlFor="remember-me">Remember Me</label>
                    </div>
                    <div>
                        <Link to="#" className="links-with-blue-underline" id="forgot-password">
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                <button type="submit" className="solid-success-btn form-user-auth-submit-btn">Login</button>
                
                <div className="guest-user-auth-container">
                    <button className="solid-primary-btn" onClick={(event)=> {loginGuestUser(event,1)}}>Rahul Sharma</button>
                    <button className="solid-primary-btn" onClick={(event)=> {loginGuestUser(event,2)}}>Priya Patel</button>
                </div>

                <div className="new-user-container">
                    <Link to="/signup" className="links-with-blue-underline" id="new-user-link">
                        Create new account &nbsp; 
                    </Link>
                </div>

            </form>
        </div>
        </div>
    )
}

export { Login }