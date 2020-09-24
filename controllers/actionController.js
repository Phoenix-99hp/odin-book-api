const db = require("../models");

exports.sendFriendRequest = (req, res) => {
	db.User.findOne({ username: req.body.username }).exec((err, result) => {
		console.log(result, "RESULT");
		if (err) {
			console.log(err);
			return;
		} else if (!result) {
			res.json(null);
		} else if (
			result.friendRequests.filter(
				(request) => request == req.body.currentUser
			)[0] !== undefined
		) {
			res.json(null);
		} else if (result._id === req.body.currentUser) {
			console.log("hello");
			res.json(null);
		} else {
			db.User.findOneAndUpdate(
				{ username: req.body.username },
				{ $push: { friendRequests: req.body.currentUser } }
			).exec((err, resultTwo) => {
				if (err) {
					console.log(err);
					return;
				} else {
					res.json({ msg: "successfully sent friend request" });
				}
			});
		}
	});
};

exports.getFriendRequests = (req, res) => {
	db.User.findOne({ _id: req.params.id })
		.populate("friendRequests")
		.exec((err, result) => {
			console.log(result);
			if (err) {
				console.log(err);
				return;
			} else if (result.friendRequests[0]) {
				res.json(result.friendRequests);
			} else {
				res.json(null);
			}
		});
};

exports.getFriendRequestsAndFriends = (req, res) => {
	db.User.findOne({ username: req.params.username }).exec((err, result) => {
		if (err) {
			console.log(err);
			return;
		} else {
			res.json(result);
			console.log("RESULT:", result);
		}
	});
};

exports.newPost = (req, res) => {
	const post = new db.Post({
		title: req.body.title,
		text: req.body.text,
		user: req.body.user,
	});
	post.save((err, result) => {
		if (err) {
			console.log("error saving post");
			return;
		} else {
			res.json(result);
		}
	});
};

exports.newComment = (req, res) => {
	const comment = new db.Comment({ text: req.body.text, user: req.body.user });
	comment.save((err, result) => {
		if (err) {
			console.log("error saving post");
			return;
		} else {
			db.Post.findByIdAndUpdate(
				req.body.postId,
				{
					$push: { comments: comment },
				},
				{ new: true }
			).exec((error, secondResult) => {
				if (error) {
					console.log(error);
				} else {
					res.json(secondResult);
				}
			});
		}
	});
};

exports.acceptFriendRequest = (req, res) => {
	if (
		db.User.findById(req.params.id)
			.populate("friends")
			.exec((err, result) => {
				if (
					result.friends.filter((friend) => friend === req.body.request)[0] !==
					undefined
				) {
					return true;
				} else {
					return false;
				}
			})
	) {
		res.json(null);
	} else {
		db.User.findOneAndUpdate(
			{ username: req.body.request },
			{
				$push: { friends: req.params.id },
			},
			{ new: true }
		).exec((error, sender) => {
			if (error) {
				console.log(error);
				return;
			} else {
				db.User.findByIdAndUpdate(
					req.params.id,
					{
						$push: { friends: sender._id },
						$pull: { friendRequests: sender._id },
					},
					{ new: true }
				).exec((err, accepter) => {
					if (err) {
						console.log(err);
					} else {
						console.log(accepter);
						res.json(accepter);
					}
				});
			}
		});
	}
};

exports.declineFriendRequest = (req, res) => {
	console.log(req.body);
	db.User.findOne({ username: req.body.request }).exec((err, result) => {
		if (err) {
			console.log(err);
			return;
		} else {
			db.User.findByIdAndUpdate(
				req.params.id,
				{
					$pull: { friendRequests: result._id },
				},
				{ new: true }
			).exec((error, whoDeclined) => {
				if (error) {
					console.log(error);
					return;
				} else {
					res.json(whoDeclined);
				}
			});
		}
	});
};

exports.getLikes = (req, res) => {
	console.log(req.body);
	db.Post.findById(req.params.postId).exec((err, result) => {
		if (err) {
			console.log(err);
		} else if (req.body.likeUnlike === "Like") {
			db.Post.findByIdAndUpdate(req.params.postId, {
				$push: { likes: req.body.currentUser },
			}).exec((err, result) => {
				if (err) {
					console.log(err);
				} else {
					res.json(req.body.likes);
				}
			});
		} else if (req.body.likeUnlike === "Un-Like") {
			db.Post.findByIdAndUpdate(req.params.postId, {
				$pull: { likes: req.body.currentUser },
			}).exec((err, result) => {
				if (err) {
					console.log(err);
				} else {
					res.json(req.body.likes);
				}
			});
		}
	});
};

exports.removeFriend = (req, res) => {
	db.User.findOneAndUpdate(
		{ username: req.params.friendUsername },
		{
			$pull: { friends: req.params.userId },
		},
		{ new: true }
	).exec((err, result) => {
		if (err) {
			console.log(err);
		} else {
			db.User.findByIdAndUpdate(
				req.params.userId,
				{
					$pull: { friends: result._id },
				},
				{ new: true }
			).exec((error, whoRemoved) => {
				if (error) {
					console.log(err);
				} else {
					console.log(whoRemoved);
					res.json(whoRemoved);
				}
			});
		}
	});
};

exports.getProfile = (req, res) => {
	db.User.findOne({ username: req.params.username }).exec((err, result) => {
		if (err) {
			console.log(err);
			res.json(null);
		} else {
			res.json(result);
		}
	});
};
