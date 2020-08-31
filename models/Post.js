const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true },
	timestamp: { type: Date, default: Date.now },
	text: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: "User" },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Post", PostSchema);
