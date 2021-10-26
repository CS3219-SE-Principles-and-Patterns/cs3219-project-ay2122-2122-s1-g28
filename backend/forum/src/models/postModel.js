const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
	userName: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	topic: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	votes: {
		type: Number,
		default: 0,
	},
	upvotedUsers: [String],
	downvotedUsers: [String],
	dateCreated: {
		type: Date,
		default: Date.now(),
	},
	displayDate: {
		type: String,
		default: new Date().toDateString(),
	},
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;

module.exports.get = function (callback, limit) {
	Post.find(callback).limit(limit);
};
