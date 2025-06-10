const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/socialzone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    profilePic: String,
    bio: String,
    following: [String],
    followers: [String]
});

// Post Schema
const postSchema = new mongoose.Schema({
    userEmail: String,
    userName: String,
    userProfilePic: String,
    postText: String,
    postImage: String,
    likes: [String],
    comments: [{
        userEmail: String,
        userName: String,
        userProfilePic: String,
        commentText: String,
        replies: [{
            userEmail: String,
            userName: String,
            userProfilePic: String,
            replyText: String
        }]
    }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Auth Routes
app.post('/api/signup', async (req, res) => {
    try {
        console.log('Signup request received:', req.body);
        const { newUserName, newUserEmail, newUserPassword } = req.body;
        
        if (!newUserName || !newUserEmail || !newUserPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: newUserEmail });
        if (existingUser) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'User with this email already exists' 
            });
        }

        const user = new User({ 
            name: newUserName, 
            email: newUserEmail, 
            password: newUserPassword,
            following: [],
            followers: []
        });
        
        await user.save();
        console.log('User created successfully:', user);
        
        res.json({ 
            status: 'ok', 
            message: 'User created successfully',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(400).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { userEmail, userPassword } = req.body;
        
        if (!userEmail || !userPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields'
            });
        }

        const user = await User.findOne({ email: userEmail, password: userPassword });
        
        if (user) {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    userProfilePic: user.profilePic || ''
                },
                'socialzone_secret_key_2024',
                { expiresIn: '24h' }
            );

            // Get user details including following list
            const userDetails = await User.findOne({ email: userEmail })
                .select('following')
                .lean();

            res.json({ 
                status: 'ok',
                user: token,
                userDetails: {
                    following: userDetails.following || []
                }
            });
        } else {
            res.status(401).json({ 
                status: 'error', 
                message: 'Invalid credentials' 
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(400).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// User Routes
app.get('/api/user/:email', async (req, res) => {
    try {
        console.log('Get user request received for:', req.params.email);
        const user = await User.findOne({ email: req.params.email });
        if (user) {
            res.json({ 
                status: 'ok', 
                user: {
                    name: user.name,
                    email: user.email,
                    profilePic: user.profilePic,
                    bio: user.bio,
                    following: user.following,
                    followers: user.followers
                }
            });
        } else {
            res.status(404).json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }
    } catch (error) {
        console.error('Get user error:', error);
        res.status(400).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// Post Routes
app.get('/api/userpost', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json({ status: 'ok', posts });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(400).json({ status: 'error', message: error.message });
    }
});

app.post('/api/userpost', async (req, res) => {
    try {
        const { userEmail, userName, userProfilePic, postText, postImage } = req.body;
        const post = new Post({
            userEmail,
            userName,
            userProfilePic,
            postText,
            postImage,
            likes: [],
            comments: []
        });
        await post.save();
        res.json({ status: 'ok', post });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(400).json({ status: 'error', message: error.message });
    }
});

app.patch('/api/userpost/updatelikes/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const { userEmail } = req.body;
        const post = await Post.findById(postId);
        
        if (!post) {
            return res.status(404).json({ status: 'error', message: 'Post not found' });
        }

        const likeIndex = post.likes.indexOf(userEmail);
        if (likeIndex === -1) {
            post.likes.push(userEmail);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json({ status: 'ok', post });
    } catch (error) {
        console.error('Update likes error:', error);
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Basic route for testing
app.get('/api/test', (req, res) => {
    console.log('Test route accessed');
    res.json({ message: 'Backend server is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 