const cors = require("cors");
const loginController = require("../controllers/loginController");
const actionController = require("../controllers/actionController");
const loadController = require("../controllers/loadController");

const corsOptions = {
	origin: "http://localhost:8000",
	optionsSuccessStatus: 200,
};

module.exports = function (app) {
	app.post("/api/login", cors(corsOptions), loginController.loginRequest);

	app.post("/api/signup", cors(corsOptions), loginController.signUpRequest);

	app.post(
		"/api/friend-request",
		cors(corsOptions),
		actionController.sendFriendRequest
	);

	app.get(
		"/api/friend-request/:id",
		cors(corsOptions),
		actionController.getFriendRequests
	);

	app.get(
		"/api/friend-request/friends/:username",
		cors(corsOptions),
		actionController.getFriendRequestsAndFriends
	);

	app.post(
		"/api/friend-request/:id/accept",
		cors(corsOptions),
		actionController.acceptFriendRequest
	);

	app.post(
		"/api/friend-request/:id/decline",
		cors(corsOptions),
		actionController.declineFriendRequest
	);

	app.post("/api/new-post", cors(corsOptions), actionController.newPost);

	app.post("/api/new-comment", cors(corsOptions), actionController.newComment);

	app.get(
		"/api/posts/:userId",
		cors(corsOptions),
		loadController.getRelevantPosts
	);

	app.get(
		"/api/posts/more/:userId/:postId",
		cors(corsOptions),
		loadController.getMorePosts
	);

	app.post(
		"/api/posts/like/:postId",
		cors(corsOptions),
		actionController.getLikes
	);

	app.get(
		"/api/posts/user-like/:currentUserId/:postId",
		cors(corsOptions),
		loadController.userLikeCheck
	);

	app.get(
		"/api/all-users/:currentUserId",
		cors(corsOptions),
		loadController.getAllUsers
	);
};
