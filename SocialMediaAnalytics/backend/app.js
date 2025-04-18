const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route 1: Fetch all users
app.get('/users', async (req, res) => {
    try {
        const response = await axios.get('http://20.244.56.144/evalutation-service/users');
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// Route 2: Fetch posts for a specific user
app.get('/users/:userId/posts', async (req, res) => {
    const { userId } = req.params;
    try {
        const response = await axios.get(`http://20.244.56.144/evalutation-service/users/${userId}/post`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error.message);
        res.status(500).json({ message: `Failed to fetch posts for user ${userId}`, error: error.message });
    }
});

// Route 3: Fetch comments for a specific post
app.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    try {
        const response = await axios.get(`http://20.244.56.144/evalutation-service/posts/${postId}/comments`);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(`Error fetching comments for post ${postId}:`, error.message);
        res.status(500).json({ message: `Failed to fetch comments for post ${postId}`, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});