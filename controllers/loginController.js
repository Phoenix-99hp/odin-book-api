const bcrypt = require("bcryptjs");
const db = require("../models");
const formidable = require("formidable");
const sharp = require("sharp");

exports.loginRequest = (req, res) => {
	db.User.findOne({ username: req.body.username }).exec((err, results) => {
		if (err) {
			res.json({
				msg:
					"Something went wrong. Make sure the username you entered is valid",
			});
		} else {
			bcrypt.compare(req.body.password, results.password, (error, response) => {
				if (response) {
					res.json(results);
				} else if (error) {
					res.json(null);
				} else {
					res.json(null);
				}
			});
		}
	});
};

exports.signUpRequest = (req, res) => {
	const form = formidable({
		multiples: false,
	});

	form.parse(req, (err, fields, files) => {
		db.User.find({ username: fields.username }, (err, result) => {
			if (err) {
				console.log("error none found");
			} else if (!result[0] && files.avatar) {
				sharp(files.avatar.path)
					.resize(120, 120)
					.toFormat("jpeg")
					.jpeg({ quality: 90 })
					.toBuffer()
					.then((data) => {
						const user = new db.User({
							username: fields.username,
							password: bcrypt.hashSync(fields.password, 10),
							profilePicture: {
								data: data,
								contentType: "image/jpeg",
							},
						});
						user
							.save((error, userResult) => {
								if (error) {
									res.json(null);
									console.log(error, "Error saving user");
								} else {
									sharp(files.avatar.path)
										.resize(60, 60)
										.toFormat("jpeg")
										.jpeg({ quality: 90 })
										.toBuffer()
										.then((avatarData) => {
											// userResult;
											db.User.findOneAndUpdate(
												{ username: fields.username },
												{
													$set: {
														"avatar.data": avatarData,
														"avatar.contentType": "image/jpeg",
													},
												},
												{ new: true }
											)
												// .update(
												// 	{
												// 		$set: {
												// 			"avatar.data": avatarData,
												// 			"avatar.contentType": "image/jpeg",
												// 		},
												// 	},
												// 	{ new: true }
												// )
												.exec((err, result) => {
													console.log(result);
													res.json(result);
												});
										});
								}
							})
							.catch((err) => console.log(err));
					});
			} else {
				res.json(null);
			}
		});
	});
};
