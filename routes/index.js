const loginController = require("../controllers/loginController");
const actionController = require("../controllers/actionController");
const loadController = require("../controllers/loadController");

module.exports = function (app) {
	app.post("/api/login", loginController.loginRequest);

	app.post("/api/signup", loginController.signUpRequest);

	app.post("/api/friend-request", actionController.sendFriendRequest);

	app.get("/api/friend-request/:id", actionController.getFriendRequests);

	app.get("/api/profile/:username", actionController.getProfile);

	app.get(
		"/api/friend-request/friends/:username",
		actionController.getFriendRequestsAndFriends
	);

	app.post(
		"/api/friend-request/:id/accept",
		actionController.acceptFriendRequest
	);

	app.post(
		"/api/friend-request/:id/decline",
		actionController.declineFriendRequest
	);

	app.put(
		"/api/friends/:userId/:friendUsername",
		actionController.removeFriend
	);

	app.post("/api/new-post", actionController.newPost);

	app.post("/api/new-comment", actionController.newComment);

	app.get("/api/posts/:userId", loadController.getRelevantPosts);

	app.get("/api/posts/user/:profile", loadController.getUserPosts);

	app.get(
		"/api/posts/user/more/:profile/:postId",
		loadController.getMoreUserPosts
	);

	app.get("/api/posts/more/:userId/:postId", loadController.getMorePosts);

	app.post("/api/posts/like/:postId", actionController.getLikes);

	app.get(
		"/api/posts/user-like/:currentUserId/:postId",
		loadController.userLikeCheck
	);

	app.get("/api/all-users/:currentUserId", loadController.getAllUsers);
};
