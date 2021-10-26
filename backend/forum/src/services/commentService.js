const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

async function getAllComments(postId) {
	const post = await Post.findById({ _id: postId }).populate("comments");
	if (post == null) {
		return null;
	}
	return post.comments;
}

async function getCommentsByUserId(userId, inputTopic) {
	const comments = await Comment.find({ userId, topic: inputTopic });
	return comments;
}

function createComment(userId, inputData, post) {
	const comment = new Comment();
	comment.userName = inputData.userName;
	comment.userId = userId;
	comment.content = inputData.content;
	comment.postId = post._id;
	comment.topic = post.topic;
	comment.save();
	post.comments.push(comment);
	post.save();
	return comment;
}

async function getCommentByID(commentId) {
	const comment = await Comment.findById(commentId);
	return comment;
}

function updateComment(comment, inputData) {
	comment.content = inputData.content ? inputData.content : comment.content;
	comment.save();
	return comment;
}

function upvoteComment(userId, comment) {
	if (comment.upvotedUsers.includes(userId)) {
		return null;
	} else {
		if (comment.downvotedUsers.includes(userId)) {
			comment.downvotedUsers.remove(userId);
			comment.votes += 2;
		} else {
			comment.votes += 1;
		}
		comment.upvotedUsers.push(userId);
		comment.save();
		return comment;
	}
}

function downvoteComment(userId, comment) {
	if (comment.downvotedUsers.includes(userId)) {
		return null;
	} else {
		if (comment.upvotedUsers.includes(userId)) {
			comment.upvotedUsers.remove(userId);
			comment.votes -= 2;
		} else {
			comment.votes -= 1;
		}
		comment.downvotedUsers.push(userId);
		comment.save();
		return comment;
	}
}

function isUserComment(commentUserId, userId) {
	return userId == commentUserId;
}

async function deleteComment(commentId, post) {
	await Comment.deleteOne({ _id: commentId });
	post.comments.remove(commentId);
	post.save();
}

async function sortCommentByVotes(postId, order) {
	const compareByVotes = { votes: order };
	const post = await Post.findById({ _id: postId }).populate({
		path: "comments",
		options: { sort: compareByVotes },
	});
	if (post == null) {
		return null;
	}
	return post.comments;
}

async function sortCommentByDate(postId, order) {
	const compareByDate = { dateCreated: order };
	const post = await Post.findById({ _id: postId }).populate({
		path: "comments",
		options: { sort: compareByDate },
	});
	if (post == null) {
		return null;
	}
	return post.comments;
}

module.exports = {
	getAllComments,
	getCommentsByUserId,
	createComment,
	getCommentByID,
	updateComment,
	upvoteComment,
	downvoteComment,
	deleteComment,
	sortCommentByVotes,
	sortCommentByDate,
	isUserComment,
};
