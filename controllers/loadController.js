const db = require("../models");

exports.getRelevantPosts = (req, res) => {
	console.log("GETTING POSTS");
	db.Post.find({ user: req.params.userId })
		.sort({ _id: -1 })
		.limit(10)
		.populate("user")
		.populate({
			path: "comments",
			populate: {
				path: "user",
			},
		})
		.exec((err, result) => {
			let combined = [...result];
			if (err) {
				console.log(err);
			} else if (result[0]) {
				// let combined = [...result];
				if (result[0].user.friends[0]) {
					const findFriends = async () => {
						for (let friend of result[0].user.friends) {
							await returnFriend(friend);
						}
						return;
					};
					const returnFriend = (x) => {
						return new Promise((resolve, reject) => {
							db.Post.find({ user: x })
								.sort({ _id: -1 })
								.limit(10)
								.populate("user")
								.populate({
									path: "comments",
									populate: {
										path: "user",
									},
								})
								.exec((error, resultFriends) => {
									if (resultFriends[0]) {
										combined = [...combined, ...resultFriends];
										resolve(combined);
									} else {
										resolve(combined);
									}
								});
						});
					};
					findFriends()
						.then(() => {
							if (combined.length > 1) {
								combined.sort((a, b) => {
									return b.timestamp - a.timestamp;
								});
							}
							combined.splice(10);
							console.log(combined, "COMBINED");
							res.json(combined);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					console.log("REAL", combined);
					res.json(combined);
				}
			} else {
				// let combined = [];
				db.User.findOne({ _id: req.params.userId }).exec(
					(error, resultUser) => {
						if (error) {
							console.log(error);
						} else if (resultUser.friends[0]) {
							const findFriends = async () => {
								for (let friend of resultUser.friends) {
									await returnFriend(friend);
								}
								return;
							};
							const returnFriend = (x) => {
								return new Promise((resolve, reject) => {
									db.Post.find({ user: x })
										.sort({ _id: -1 })
										.limit(10)
										.populate("user")
										.populate({
											path: "comments",
											populate: {
												path: "user",
											},
										})
										.exec((anError, resultFriend) => {
											if (resultFriend[0]) {
												combined = [...combined, ...resultFriend];
												resolve(combined);
											} else {
												resolve(combined);
											}
										});
								});
							};
							findFriends()
								.then(() => {
									console.log("Final", combined);
									combined.sort((a, b) => {
										return b.timestamp - a.timestamp;
									});
									combined.splice(10);
									res.json(combined);
								})
								.catch((err) => {
									console.log(err);
								});
						} else {
							res.json(null);
						}
					}
				);
			}
		});
};

exports.getMorePosts = (req, res) => {
	db.Post.find({ user: req.params.userId })
		.sort({ _id: -1 })
		.populate("user")
		.populate({
			path: "comments",
			populate: {
				path: "user",
			},
		})
		.exec((err, result) => {
			if (result) {
				let morePosts = result.filter((post, index) => {
					return post._id < req.params.postId;
				});
				if (morePosts[0]) {
					if (morePosts[0].user.friends[0]) {
						const findFriends = async () => {
							for (let friend of result[0].user.friends) {
								await returnFriend(friend);
							}
							return;
						};
						const returnFriend = (x) => {
							return new Promise((resolve, reject) => {
								db.Post.find({ user: x })
									.populate("user")
									.populate({
										path: "comments",
										populate: {
											path: "user",
										},
									})
									.sort({ _id: -1 })
									.exec((err, resultFriends) => {
										// let filteredFriends = resultFriends.filter((post, index) => {
										//     return post._id < req.params.postId;
										// });
										if (resultFriends[0]) {
											morePosts = [...morePosts, resultFriends];
											resolve(morePosts);
										}
										// else if (filteredFriends[0] && index === result[0].user.friends.length - 1) {
										//     morePosts = [...morePosts, filteredFriends];
										//     resolve(morePosts);
										// }
										// else if (!filteredFriends[0] && index !== result[0].user.friends.length - 1) {
										//     return;
										// }
										// else if (!filteredFriends[0] && index === result[0].user.friends.length - 1) {
										//     resolve(morePosts);
										// }
										else {
											resolve(morePosts);
										}
									});
							});
						};
						findFriends()
							.then(() => {
								const hasMore = morePosts.length;
								morePosts.sort((a, b) => {
									return b.timestamp - a.timestamp;
								});
								morePosts.splice(10);
								console.log("morePosts final", morePosts);
								res.json({ additionalPosts: morePosts, hasMore: hasMore });
							})
							.catch((err) => {
								console.log(err);
							});
					}
				}
			} else {
				res.json(null);
			}
		});
};

exports.userLikeCheck = (req, res) => {
	db.Post.findById(req.params.postId).exec((err, result) => {
		if (err) {
			console.log(err);
		} else if (result.likes.includes(req.params.currentUserId)) {
			res.json(true);
		} else {
			res.json(false);
		}
	});
};

exports.getAllUsers = (req, res) => {
	db.User.find().exec((err, result) => {
		if (result) {
			const filteredCurrent = result.filter((user) => {
				return user._id.toString() !== req.params.currentUserId.toString();
			});
			// const filteredFriends = filteredCurrent.filter((user) => {
			// 	return user.friends.includes(req.params.currentUserId) === false;
			// });
			res.json(filteredCurrent);
		} else {
			res.json(null);
		}
	});
};

exports.getUserPosts = (req, res) => {
	db.User.findOne({ username: req.params.profile }).exec((err, result) => {
		if (err) {
			console.log(err);
		} else if (result) {
			db.Post.find({ user: result._id })
				.sort({ _id: -1 })
				.limit(10)
				.populate("user")
				.populate({
					path: "comments",
					populate: {
						path: "user",
					},
				})
				.exec((error, resultTwo) => {
					if (err) {
						console.log(err);
					} else if (resultTwo) {
						res.json(resultTwo);
						console.log(resultTwo);
					} else {
						res.json(null);
					}
				});
		} else {
			res.json(null);
		}
	});
};

exports.getMoreUserPosts = (req, res) => {
	db.User.findOne({ username: req.params.profile }).exec((err, result) => {
		if (err) {
			console.log(err);
		} else {
			db.Post.find({ user: result._id })
				.sort({ _id: -1 })
				.populate("user")
				.populate({
					path: "comments",
					populate: {
						path: "user",
					},
				})
				.exec((error, resultTwo) => {
					if (error) {
						console.log(error);
					} else {
						let morePosts = resultTwo.filter((post, index) => {
							return post._id < req.params.postId;
						});
						const hasMore = morePosts.length;
						morePosts.sort((a, b) => {
							return b.timestamp - a.timestamp;
						});
						morePosts.splice(10);
						console.log("result final", morePostso);
						res.json({ additionalPosts: morePosts, hasMore: hasMore });
					}
				});
		}
	});
};

// exports.getProfile = (req, res) => {
// 	db.User.findOne(req.params.username)
// 	.populate()
// 	.exec((err, result) => {
// 		if (err) {
// 			console.log(err);
// 		} else if (result.likes.includes(req.params.currentUserId)) {
// 			res.json(true);
// 		} else {
// 			res.json(false);
// 		}
// 	});
// };
