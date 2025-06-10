import apiService from "./axiosService";

export const addReplyToPostComment = param => {
    return apiService()
    .patch(`/userpost/create-new-reply/${param.postId}/${param.commentId}`,{newReplyText: param.newReplyText})
    .then(response => {
        return response
    })
}

export const addCommentToPost = param => {
    return apiService()
    .patch(`/userpost/create-new-comment/${param.postId}`,{newCommentText: param.newCommentText})
    .then(response => {
        return response
    })
}

export const fetchUserFollowers = loggedInUserEmail => {
    return apiService()
    .get(`/user/followers/${loggedInUserEmail}`)
    .then(response => {
        return response
    })
}

export const createNewChat = param => {
    return apiService()
    .post('/chat',{newChatUsers: param.newChatUsers})
    .then(response => {
        return response
    })
}

export const createNewPost = param => {
    return apiService()
    .post('/userpost',param)
    .then(response => {
        return response
    })
}

export const updateUserPost = param => {
    return apiService()
    .patch(`/userpost/edit/${param.postId}`,param)
    .then(response => {
        return response
    })
}

export const updateUserProfile = param => {
    return apiService()
    .patch(`/user/edit`,param)
    .then(response => {
        return response
    })
}

export const fetchUpdatedPosts = param => {
    return apiService()
    .patch(`/userpost/updatelikes/${param.postId}`)
    .then(response => {
        return response
    })
}

export const deletePost = postId => {
    return apiService()
    .delete(`/userpost/delete/${postId}`)
    .then(response => {
        return response
    })
}

export const bookmarkPost = postId => {
    return apiService()
    .patch(`/userpost/bookmark/${postId}`)
    .then(response => {
        return response
    })
}

export const loginUser = param => {
    return apiService()
    .post('/login',param)
    .then(response => {
        return response
    })
}

export const signupUser = param => {
    return apiService()
    .post('/signup',param)
    .then(response => {
        return response
    })
}

export const fetchUserChatList = loggedInUserEmail => {
    return apiService()
    .get(`/chat/user/${loggedInUserEmail}`)
    .then(response => {
        return response
    })
}

export const fetchChatDetails = param => {
    return apiService()
    .get(`/chat/messages?chatid=${param.chatId}&userid=${param.userId}`)
    .then(response => {
        return response
    })
}

export const sendMessage = param => {
    return apiService()
    .post('/chat/messages',param)
    .then(response => {
        return response
    })
}

export const fetchUpdatedHomeFeed = () => {
    return apiService()
    .get(`/userpost`)
    .then(response => {
        return response
    })
}

export const fetchUserLikedPosts = () => {
    return apiService()
    .get(`/userpost/likedposts`)
    .then(response => {
        return response
    })
}

export const fetchUserDetails = loggedInUserEmail => {
    return apiService()
    .get(`/user/${loggedInUserEmail}`)
    .then(response => {
        return response
    })
}

export const updateUserFollowing = param => {
    return apiService()
    .patch(`/user/following`,param)
    .then(response => {
        return response
    })
}