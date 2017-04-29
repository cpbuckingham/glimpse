"use strict";
/*eslint no-unused-vars: 0*/

const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

function authorizedUser(req, res, next) {
    let userID = req.session.user.id;
    if(userID){
        next();
    } else {
        res.render("partials/404");
    }
}

router.get("/:id", authorizedUser, function (req, res, next) {
    let userID = req.session.user.id;
    let surveyID = req.params.id;
    knex.from("submissions").where({read: false, user_id: userID}).then(function (unread) {
        knex("users").where("id", userID).first().then(function (user){
            knex("submissions").where("survey_id", surveyID).then(function (submissions){
                res.render("analysis/single", {
                    unread: unread,
                    user: user,
                    submissions: submissions,
                });
            });
        });
    });
});

module.exports = router;
