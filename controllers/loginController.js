const bcrypt = require("bcryptjs");
const db = require("../models");

exports.loginRequest = (req, res) => {
    db.User.findOne({ username: req.body.username })
        .exec((err, results) => {
            if (err) {
                res.json({
                    msg:
                        "Something went wrong. Make sure the username you entered is valid",
                })
            }
            else {
                bcrypt.compare(
                    req.body.password,
                    results.password,
                    (error, response) => {
                        if (response) {
                            res.json(results);
                        }
                        else if (error) {
                            res.json(null);
                        }
                        else {
                            res.json(null);
                        }
                    }
                )
            }
        })
}

exports.signUpRequest = (req, res) => {
    console.log(req.body);
    db.User.find({ username: req.body.username }, (err, result) => {
        if (err) {
            console.log("error none found");
        }
        else if (result) {
            const user = new db.User({ username: req.body.username, password: bcrypt.hashSync(req.body.password, 10) })
            user.save((error, userResult) => {
                if (error) {
                    res.json(null);
                    console.log(error, "Error saving user");
                }
                else {
                    res.json(userResult);
                }
            })
        }
        else {
            res.json(null);
        }
    })
};
