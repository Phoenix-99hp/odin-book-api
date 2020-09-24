const db = require("../models");

exports.getRelevantPosts = (req, res) => {
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
							res.json(combined);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
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
							console.log("NULL");
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
			console.log(result, "RESULTTTTTT");
			if (result[0]) {
				let morePosts = result.filter((post, index) => {
					return post._id < req.params.postId;
				});
				console.log(morePosts, "MORE");
				if (morePosts[0]) {
					console.log(morePosts[0].user.friends, "MOREPOSTS0");
					if (morePosts[0].user.friends[0]) {
						const findFriends = async () => {
							console.log("FF");
							for (let friend of morePosts[0].user.friends) {
								await returnFriend(friend);
							}
							return;
						};
						const returnFriend = (x) => {
							console.log("RETURN FRIEND");
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
										if (resultFriends[0]) {
											let resFriendsPost = resultFriends.filter(
												(post, index) => {
													return post._id < req.params.postId;
												}
											);
											if (resFriendsPost[0]) {
												morePosts = [...morePosts, ...resFriendsPost];
												resolve(morePosts);
											} else {
												resolve(morePosts);
											}
										} else {
											resolve(morePosts);
										}
									});
							});
						};
						findFriends()
							.then(() => {
								console.log("ALMOST THERE");
								const hasMore = morePosts.length - 10;
								morePosts.sort((a, b) => {
									return b.timestamp - a.timestamp;
								});
								morePosts.splice(10);
								res.json({ additionalPosts: morePosts, hasMore: hasMore });
							})
							.catch((err) => {
								console.log(err);
							});
					}
				} else {
					if (result[0]) {
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
										.populate("user")
										.populate({
											path: "comments",
											populate: {
												path: "user",
											},
										})
										.sort({ _id: -1 })
										.exec((err, resultFriends) => {
											if (resultFriends[0]) {
												let resFriendsPost = resultFriends.filter(
													(post, index) => {
														return post._id < req.params.postId;
													}
												);
												if (resFriendsPost[0]) {
													morePosts = [...morePosts, ...resFriendsPost];
													resolve(morePosts);
												} else {
													resolve(morePosts);
												}
											} else {
												resolve(morePosts);
											}
										});
								});
							};
							findFriends()
								.then(() => {
									console.log("ALMOST THERE");
									const hasMore = morePosts.length - 10;
									morePosts.sort((a, b) => {
										return b.timestamp - a.timestamp;
									});
									morePosts.splice(10);
									res.json({ additionalPosts: morePosts, hasMore: hasMore });
								})
								.catch((err) => {
									console.log(err);
								});
						} else {
							console.log("MYSTERY");
						}
					}
				}
			} else {
				console.log("LAST ELSE");
				db.User.findOne({ _id: req.params.userId })
					.populate("friends")
					.exec((err, result) => {
						let morePosts = [];
						if (result) {
							if (result.friends[0]) {
								const findFriends = async () => {
									for (let friend of result.friends) {
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
												if (resultFriends[0]) {
													let resFriendsPost = resultFriends.filter(
														(post, index) => {
															return post._id < req.params.postId;
														}
													);
													if (resFriendsPost[0]) {
														morePosts = [...morePosts, ...resFriendsPost];
														resolve(morePosts);
													} else {
														resolve(morePosts);
													}
												} else {
													resolve(morePosts);
												}
											});
									});
								};
								findFriends()
									.then(() => {
										const hasMore = morePosts.length - 10;
										morePosts.sort((a, b) => {
											return b.timestamp - a.timestamp;
										});
										morePosts.splice(10);
										res.json({ additionalPosts: morePosts, hasMore: hasMore });
									})
									.catch((err) => {
										console.log(err);
									});
							}
						} else {
							console.log("NULL");
							res.json(null);
						}
					});
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
	console.log("getMoreUserPosts");
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
					console.log("RES2", resultTwo);
					if (error) {
						console.log(error);
					} else {
						let morePosts = resultTwo.filter((post, index) => {
							return post._id < req.params.postId;
						});
						const hasMore = morePosts.length - 10;
						morePosts.sort((a, b) => {
							return b.timestamp - a.timestamp;
						});
						morePosts.splice(10);
						res.json({ additionalPosts: morePosts, hasMore: hasMore });
					}
				});
		}
	});
};
