const {
	resultsValidator,
	addCommentValidator,
} = require("../validators/commentValidator");
const { validationResult, check } = require("express-validator");
let Comment = require("../models/commentModel");
let Post = require("../models/postModel");

exports.viewPostComments = function async(req, res) {
	Post.findById(req.params.post_id, function (err, post) {
		if (post == null) {
			res.status(404).json({
				status: "error",
				msg: "Post not found!",
			});
			return;
		}

		Post.findById({ _id: req.params.post_id })
			.populate("comments")
			.then((post, err) => {
				if (post == null) {
					res.status(404).json({
						status: "error",
						msg: "Comments not found!",
					});
					return;
				}
				if (err) res.send(err);
				if (post.comments.length == 0) {
					res.status(200).json({
						status: "success",
						msg: "There are no comments in this post", // tells client that the post has no comments
					});
				} else {
					res.status(200).json({
						status: "success",
						msg: "Comment details loading..",
						data: post.comments,
					});
				}
			});
	});
};

exports.createComment = [
	addCommentValidator(),
	(req, res) => {
		var comment = new Comment();
		comment.userName = req.body.userName;
		comment.userId = req.body.userId;
		comment.content = req.body.content;
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(404).json(errors.array());
		}

		Post.findById(req.params.post_id, function (err, post) {
			if (post == null) {
				res.status(404).json({
					status: "error",
					msg: "Post not found!",
				});
				return;
			}
			if (err) res.send(err);
			comment.postId = req.params.post_id;
			comment.save();
			post.comments.push(comment);
			// save the post and check for errors
			post.save(function (err) {
				if (err) res.json(err);
				res.status(200).json({
					status: "success",
					msg: "Comment is created!",
					data: post,
				});
			});
		});
	},
];

exports.viewComment = function (req, res) {
	Comment.findById(req.params.comment_id, function (err, comment) {
		if (comment == null) {
			res.status(404).json({
				status: "error",
				msg: "Comment not found!",
			});
			return;
		}
		if (err) res.send(err);
		res.status(200).json({
			status: "success",
			msg: "Comment details loading..",
			data: comment,
		});
	});
};

exports.updateComment = function (req, res) {
	Comment.findById(req.params.comment_id, function (err, comment) {
		if (comment == null) {
			res.status(404).json({
				status: "error",
				msg: "Comment not found!",
			});
			return;
		}
		if (err) res.send(err);
		var userId = req.params.user_id;
		var commentUserId = comment.userId;

		if (userId == commentUserId) {
			comment.content = req.body.content ? req.body.content : comment.content;
		} else {
			res.status(404).json({
				status: "error",
				msg: "User is not authorised to edit this comment",
			});
			return;
		}
		// save the comment and check for errors
		comment.save(function (err) {
			if (err) res.json(err);
			res.status(200).json({
				status: "success",
				msg: "Comment content updated",
				data: comment,
			});
		});
	});
};

exports.upvoteComment = function (req, res) {
	Comment.findById(req.params.comment_id, function (err, comment) {
		if (comment == null) {
			res.status(404).json({
				status: "error",
				msg: "Comment not found!",
			});
			return;
		}
		if (err) res.send(err);
		var userId = req.params.user_id;
		var commentUserId = comment.userId;

		if (userId == commentUserId) {
			res.status(404).json({
				status: "error",
				msg: "Users are not allowed to upvote/downvote their own comments",
			});
			return;
		} else {
			if (comment.votedUsers.includes(userId)) {
				res.status(404).json({
					status: "error",
					msg: "Users can only upvote/downvote a comment ONCE",
				});
				return;
			}
			comment.votes = comment.votes + 1;
			comment.votedUsers.push(userId);
		}
		// save the comment and check for errors
		comment.save(function (err) {
			if (err) res.json(err);
			res.status(200).json({
				status: "success",
				msg: "Comment has been upvoted!",
				data: comment,
			});
		});
	});
};

exports.downvoteComment = function (req, res) {
	Comment.findById(req.params.comment_id, function (err, comment) {
		if (comment == null) {
			res.status(404).json({
				status: "error",
				msg: "Comment not found!",
			});
			return;
		}
		if (err) res.send(err);
		var userId = req.params.user_id;
		var commentUserId = comment.userId;

		if (userId == commentUserId) {
			res.status(404).json({
				status: "error",
				msg: "Users are not allowed to upvote/downvote their own comments",
			});
			return;
		} else {
			if (comment.votedUsers.includes(userId)) {
				res.status(404).json({
					status: "error",
					msg: "Users can only upvote/downvote a comment ONCE",
				});
				return;
			}
			comment.votes = comment.votes - 1;
			comment.votedUsers.push(userId);
		}
		// save the comment and check for errors
		comment.save(function (err) {
			if (err) res.json(err);
			res.status(200).json({
				status: "success",
				msg: "Comment has been downvoted!",
				data: comment,
			});
		});
	});
};

exports.deleteComment = function (req, res) {
	Post.findById(req.params.post_id, function (err, post) {
		if (post == null) {
			res.status(404).json({
				status: "error",
				msg: "Post not found!",
			});
			return;
		}
		if (err) res.send(err);
		Comment.findById(req.params.comment_id, function (err, comment) {
			if (comment == null) {
				res.status(404).json({
					status: "error",
					msg: "Comment not found!",
				});
				return;
			}
			var userId = req.params.user_id;
			var commentUserId = comment.userId;

			if (userId == commentUserId) {
				Comment.deleteOne(
					{
						_id: req.params.comment_id,
					},
					function (err, comment) {
						post.comments.remove(req.params.comment_id); // removes comment in Post Collection
						// save the post and check for errors
						post.save(function (err) {
							if (err) res.json(err);
							res.status(200).json({
								status: "success",
								msg: "Comment deleted",
							});
						});
					}
				);
			} else {
				res.status(404).json({
					status: "error",
					msg: "User is not authorised to delete this comment",
				});
				return;
			}
		});
	});
};

exports.sortCommentsByAscVotes = function async(req, res) {
	Post.findById(req.params.post_id, function (err, post) {
		if (post == null) {
			res.status(404).json({
				status: "error",
				msg: "Post not found!",
			});
			return;
		}

		Post.findById({ _id: req.params.post_id })
			.populate({ path: "comments", options: { sort: { votes: 1 } } })
			.then((post, err) => {
				if (post == null) {
					res.status(404).json({
						status: "error",
						msg: "Comments not found!",
					});
					return;
				}
				if (err) res.send(err);
				if (post.comments.length == 0) {
					res.status(200).json({
						status: "sucess",
						msg: "There are no comments in this post", // tells client that the post has no comments
					});
				} else {
					res.status(200).json({
						status: "success",
						msg: "Comment details loading..",
						data: post.comments,
					});
				}
			});
	});
};

exports.sortCommentsByDescVotes = function async(req, res) {
	Post.findById(req.params.post_id, function (err, post) {
		if (post == null) {
			res.status(404).json({
				status: "error",
				msg: "Post not found!",
			});
			return;
		}

		Post.findById({ _id: req.params.post_id })
			.populate({ path: "comments", options: { sort: { votes: -1 } } })
			.then((post, err) => {
				if (post == null) {
					res.status(404).json({
						status: "error",
						msg: "Comments not found!",
					});
					return;
				}
				if (err) res.send(err);
				if (post.comments.length == 0) {
					res.status(200).json({
						status: "success",
						msg: "There are no comments in this post", // tells client that the post has no comments
					});
				} else {
					res.status(200).json({
						status: "success",
						msg: "Comment details loading..",
						data: post.comments,
					});
				}
			});
	});
};

exports.sortCommentsByAscDate = function async(req, res) {
	Post.findById(req.params.post_id, function (err, post) {
		if (post == null) {
			res.status(404).json({
				status: "error",
				msg: "Post not found!",
			});
			return;
		}

		Post.findById({ _id: req.params.post_id })
			.populate({ path: "comments", options: { sort: { dateCreated: 1 } } })
			.then((post, err) => {
				if (post == null) {
					res.status(404).json({
						status: "error",
						msg: "Comments not found!",
					});
					return;
				}
				if (err) res.send(err);
				if (post.comments.length == 0) {
					res.status(200).json({
						status: "sucess",
						msg: "There are no comments in this post", // tells client that the post has no comments
					});
				} else {
					res.status(200).json({
						status: "success",
						msg: "Comment details loading..",
						data: post.comments,
					});
				}
			});
	});
};

exports.sortCommentsByDescDate = function async(req, res) {
	Post.findById(req.params.post_id, function (err, post) {
		if (post == null) {
			res.status(404).json({
				status: "error",
				msg: "Post not found!",
			});
			return;
		}

		Post.findById({ _id: req.params.post_id })
			.populate({ path: "comments", options: { sort: { dateCreated: -1 } } })
			.then((post, err) => {
				if (post == null) {
					res.status(404).json({
						status: "error",
						msg: "Comments not found!",
					});
					return;
				}
				if (err) res.send(err);
				if (post.comments.length == 0) {
					res.status(200).json({
						status: "success",
						msg: "There are no comments in this post", // tells client that the post has no comments
					});
				} else {
					res.status(200).json({
						status: "success",
						msg: "Comment details loading..",
						data: post.comments,
					});
				}
			});
	});
};
