import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import jwt_decode from "jwt-decode";
import { 
    AiOutlineHome,
    AiOutlineBell 
} from "../../assets/react-icons"
import { useUserLogin, useToast } from "../../context/index"
import {
    refreshHomeFeed,
    updateAllUserLikedPosts,
    updateUserDetails,
    updateCurrentProfile
} from "../../actions/index"
import {
    useEditPostModal
} from "../../context/index"
import './Navbar.css'

function Navbar() {

    const userDetails = useSelector(state => state.userDetailsReducer)
    const {
        loggedInUserFollowing
    } = userDetails
    const dispatch = useDispatch()
    const location = useLocation()

    const { userLoggedIn, setUserLoggedIn } = useUserLogin(false)
    const { showToast } = useToast()
    const { setShowEditModal } = useEditPostModal()

    useEffect(()=>{
        const token=localStorage.getItem('socioztron-user-token')
        if(token)
        {
            const user = jwt_decode(token)
            if(!user)
            {
                localStorage.removeItem('socioztron-user-token')
                setUserLoggedIn(false)
            }
            else
            {
                (async()=>{
                    if(""===user.userProfilePic)
                    {
                        dispatch(updateUserDetails({
                            loggedInUserId: user._id,
                            loggedInUserName: user.name, 
                            loggedInUserEmail: user.email, 
                            loggedInUserProfile: "https://api.iconify.design/ph:user-circle-thin.svg",
                            loggedInUserFollowing: loggedInUserFollowing
                        }))
                    }
                    else
                    {
                        dispatch(updateUserDetails({
                            loggedInUserId: user._id,
                            loggedInUserName: user.name, 
                            loggedInUserEmail: user.email, 
                            loggedInUserProfile: user.userProfilePic,
                            loggedInUserFollowing: loggedInUserFollowing
                        }))
                    }
                    setUserLoggedIn(true)
                })()   
            }
        }
    },[userLoggedIn])

    function logoutUser()
    {
        dispatch(updateUserDetails({
            loggedInUserId: "",
            loggedInUserName: "", 
            loggedInUserEmail: "", 
            loggedInUserProfile: "https://api.iconify.design/ph:user-circle-thin.svg",
            loggedInUserFollowing: []
        }))
        dispatch(updateAllUserLikedPosts([]))
        localStorage.removeItem('socioztron-user-token')
        setUserLoggedIn(false)
        localStorage.clear()
        dispatch(refreshHomeFeed())
        setShowEditModal(false)
        dispatch(updateCurrentProfile({
            allPosts: [],
            bookmarks: [],
            email: "",
            following: [],
            likedPosts: [],
            messages: [],
            name: "",
            password: "",
            portfolioLink: "",
            profileBackgroundSrc: "",
            profilePicSrc: "",
            userBio: "",
            userDob: "",
        }))
        showToast("success","Logged out successfully")
    }
    
    return (
        <div className="top-bar">
            <div className="left-topbar-container">
                {/* <button id="top-bar-ham-menu-btn" className="icon-btn"><i className="fa fa-bars" aria-hidden="true"></i></button> */}
                <Link to="/">
                    <h2 className="top-bar-brand-name">SocialZone</h2>
                </Link>
                <div className="search-bar">
                    <input className="search-bar-input" placeholder="Search SocialZone"/>
                    <button id="search-bar-btn">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div className="right-topbar-container">
                {
                    localStorage.getItem('socioztron-user-token')!==null
                    ? (
                        <button onClick={logoutUser} className="navbar-login-btn solid-primary-btn">Logout</button>
                    )
                    : (
                        <Link to="/login">
                            <button className="navbar-login-btn solid-primary-btn">Login</button>
                        </Link>
                    )
                }
                {
                    (location.pathname==="/login"||location.pathname==="/signup") && 
                    <Link to="/">
                        <button className="icon-btn">
                            <div>
                                <AiOutlineHome/>
                            </div>
                        </button>
                    </Link>
                }
                {/* <button className="icon-btn">
                    <div className="icon-count-badge">
                        <AiOutlineBell/>
                        {
                            // userNotifications.length!==0 &&
                            (<span className="count-badge-x">{4}</span>)
                        }
                    </div>
                </button> */}
            </div>
        </div>
    )
}

export {Navbar};