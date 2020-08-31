const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	timestamp: { type: Date, default: Date.now },
	text: { type: String, required: true },
	user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Comment", CommentSchema);
