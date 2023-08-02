// Create web server

// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

// Create app
const app = express();

// Use cors
app.use(cors());

// Use body parser
app.use(bodyParser.json());

// Create comments object
const commentsByPostId = {};

// Create function to handle events
const handleEvent = (type, data) => {
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        // Get comments of the post
        const comments = commentsByPostId[postId] || [];

        // Add new comment to the list
        comments.push({ id, content, status });

        // Update comments
        commentsByPostId[postId] = comments;
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        // Get comments of the post
        const comments = commentsByPostId[postId];

        // Find the comment to update
        const comment = comments.find(comment => {
            return comment.id === id;
        });

        // Update the comment
        comment.status = status;
        comment.content = content;
    }
};

// Get all comments
app.get('/posts/:id/comments', (req, res) => {
    // Get comments of the post
    const comments = commentsByPostId[req.params.id] || [];

    // Send back comments
    res.send(comments);
});

// Create new comment
app.post('/posts/:id/comments', async (req, res) => {
    // Get comment from request
    const { content } = req.body;

    // Create new comment
    const commentId = Math.random().toString(36).substr(2, 7);

    // Get comments of the post
    const comments = commentsByPostId[req.params.id] || [];

    // Add new comment to the list
    comments.push({ id: commentId, content, status: 'pending' });

    // Update comments
    commentsByPostId[req.params.id] = comments;

    // Send event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status:




