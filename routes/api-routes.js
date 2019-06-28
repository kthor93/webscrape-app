const axios = require("axios");
const cheerio = require("cheerio");

const db = require("../models");

module.exports = function (app) {
    app.get("/scrape", function (req, res) {

        axios.get("https://old.reddit.com/r/WebdevTutorials/top/?sort=top&t=year").then(function (response) {

            const $ = cheerio.load(response.data);

            $("top-matter").each(function (i, element) {

                let result = {};

                result.title = $(element)
                    .children("a")
                    .text();
                result.link = $(element)
                    .find("a")
                    .attr("href");
                result.postAge = $(element)
                    .find("time")
                    .text();

                db.Post.create(result)
                    .then(function (dbPost) {
                        console.log(dbPost);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
            res.send("Scrape Complete");
        });
    });

    app.get("/posts", function (req, res) {

        db.Post.find({})
            .then(function (dbPost) {
                res.json(dbPost);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/posts/:id", function (req, res) {
        db.Post.findOne({ _id: req.params.id })
            .populate("comment")
            .then(function (dbPost) {
                res.json(dbPost);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.post("/posts/:id", function (req, res) {
        db.Comment.create(req.body)
            .then(function (dbComment) {
                return db.Post.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
            })
            .then(function (dbPost) {
                res.json(dbPost);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
};