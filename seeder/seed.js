require("dotenv").config();
const mongoose = require("mongoose");
const db = require("../models");
const bcrypt = require("bcryptjs");

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

const comments = [];
const blogUser = [];

function userCreate(username, password, avatar, profilePicture) {
	const user = new db.User({
		username: username,
		password: password,
		avatar: avatar,
		profilePicture: profilePicture,
	});
	blogUser.push(user);
	user.save((err, result) => {
		if (err) {
			console.log(err, "Error saving user");
			return;
		}
	});
}

function postCreate(title, text, user, comments) {
	const post = new db.Post({
		title: title,
		text: text,
		user: user,
		comments: comments,
	});
	post.save(function (err, result) {
		if (err) {
			console.log("Error saving post", err);
			return;
		}
	});
}

function commentCreate(user, text) {
	const comment = new db.Comment({ text: text, user: user });
	comments.push(comment);
	comment.save(function (err, result) {
		if (err) {
			console.log("Error saving comment", err);
			return;
		}
	});
}

function createUser() {
	userCreate(
		"Drake McGarrah",
		bcrypt.hashSync(process.env.USER_PW, 10),
		"../images/phoenixlogo.jpg",
		"../images/phoenixlogo.jpg"
	);
}

function createPosts() {
	console.log(comments);
	postCreate("Hello", "All", blogUser[0], [comments[0]]);
	postCreate("Always", "Trust", blogUser[0], [comments[1]]);
	postCreate("Here", "Now", blogUser[0], [comments[2]]);
	postCreate("Follow", "Light", blogUser[0], [comments[3]]);
	postCreate("Hopefully", "Care", blogUser[0], [comments[4]]);
	postCreate("Eyes", "Up", blogUser[0], [comments[5]]);
	postCreate("Wise", "King", blogUser[0], [comments[6]]);
	postCreate("Hair", "Sparrows", blogUser[0], [comments[7]]);
	postCreate("Do", "Work", blogUser[0], [comments[8]]);
	postCreate("What", "Next?", blogUser[0], [comments[9]]);
}

function createComments() {
	commentCreate(blogUser[0], "Be Better");
	commentCreate(blogUser[0], "Do Right");
	commentCreate(blogUser[0], "Don't Fail");
	commentCreate(blogUser[0], "Don't Fall");
	commentCreate(blogUser[0], "Don't Harm");
	commentCreate(blogUser[0], "Everything Matters");
	commentCreate(blogUser[0], "No Mulligans");
	commentCreate(blogUser[0], "Follow Rules");
	commentCreate(blogUser[0], "Spirit True");
	commentCreate(blogUser[0], "Love All");
}

function createData(cb) {
	db.User.deleteMany({})
		.then(() => db.Post.deleteMany({}))
		.then(() => db.Comment.deleteMany({}))
		.then(() =>
			createUser("Drake McGarrah", bcrypt.hashSync(process.env.USER_PW, 10))
		)
		.then(() => createComments())
		.then(() => createPosts())
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
	cb;
}

createData(
	setTimeout(() => {
		console.log("data created");
		process.exit(0);
	}, 1000)
);
