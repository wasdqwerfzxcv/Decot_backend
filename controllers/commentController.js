const { Comment,User } = require('../models');

const createComment = async (req, res) => {
    try {
        const { text, canvasId, x, y } = req.body;
        const parentId = 1; // how to handle this?
        const userId = req.user.id;
        const newComment = await Comment.create({ text, canvasId, userId, parentId, x, y });
        const commentWithUser = await Comment.findByPk(newComment.id, {
            include: [{ model: User }]
        });
        if (commentWithUser) {
            res.status(201).json({ comment: commentWithUser });
        } else {
            res.status(404).json({ error: "Comment created but not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCommentsByCanvas = async (req, res) => {
    try {
        const canvasId = req.params.canvasId;
        const comments = await Comment.findAll({
            where: { canvasId },
            include: [{
                model: User,
            }]
        });
        if (comments && comments.length > 0) {
            res.json({ comments: comments });
        } else {
            res.json({ comments: [], message: "No comments found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const { text, x, y } = req.body;
        const comment = await Comment.findByPk(commentId, {
            include: [{
                model: User,
            }]
        });
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        comment.text = text;
        comment.x = x;
        comment.y = y;
        await comment.save();
        res.json({ comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        await Comment.destroy({ where: { id: commentId } });
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleCommentResolvedState = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByPk(commentId, {
            include: [{
                model: User,
            }]
        });
        if (comment) {
            comment.resolved = !comment.resolved;
            await comment.save();
            res.json({ message: `Comment ${comment.resolved ? 'resolved' : 'unresolved'} successfully`, comment });
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByCanvas,
    updateComment,
    deleteComment,
    toggleCommentResolvedState,
};
