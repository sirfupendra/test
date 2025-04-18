import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [error, setError] = useState('');

  const dummyUsers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
  ];

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users');
      setUsers(response.data);
      setPosts([]);
      setComments([]);
      setError('');
    } catch (err) {
      setError('Failed to fetch users. Showing dummy data.');
      console.error(err);
      setUsers(dummyUsers); // Set dummy data as fallback
    }
  };

  // Fetch posts for a specific user
  const fetchPosts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/users/${userId}/posts`);
      setPosts(response.data);
      setComments([]);
      setSelectedUserId(userId);
      setError('');
    } catch (err) {
      setError(`Failed to fetch posts for user ${userId}`);
      console.error(err);
    }
  };

  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:4000/posts/${postId}/comments`);
      setComments(response.data);
      setSelectedPostId(postId);
      setError('');
    } catch (err) {
      setError(`Failed to fetch comments for post ${postId}`);
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>Social Media Analytics</h1>

      {/* Fetch Users */}
      <div className="section">
        <button onClick={fetchUsers}>Fetch All Users</button>
        {users.length > 0 && (
          <div className="results">
            <h2>Users:</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name}{' '}
                  <button onClick={() => fetchPosts(user.id)}>View Posts</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Fetch Posts */}
      {posts.length > 0 && (
        <div className="section">
          <h2>Posts for User {selectedUserId}:</h2>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                {post.title}{' '}
                <button onClick={() => fetchComments(post.id)}>View Comments</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Fetch Comments */}
      {comments.length > 0 && (
        <div className="section">
          <h2>Comments for Post {selectedPostId}:</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;