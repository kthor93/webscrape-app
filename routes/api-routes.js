const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("../models");

module.exports = function (app) {
    // GET route to scrape the subreddit
    app.get("/scrape", function (req, res) {
        // Grab the body of the html with axios
        axios.get("https://old.reddit.com/r/WebdevTutorials/top/?sort=top&t=year").then(function (response) {
            // Load that into cheerio
            const $ = cheerio.load(response.data);

            // Grab every top-matter div
            $("top-matter").each(function (i, element) {
                // Save an empty result object
                let result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(element)
                    .children("a")
                    .text();
                result.link = $(element)
                    .find("a")
                    .attr("href");
                result.postAge = $(element)
                    .find("time")
                    .text();

                // Create a new Post using the `result` object built from scraping
                db.Post.create(result)
                    .then(function (dbPost) {
                        // View the added result in the console
                        console.log(dbPost);
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });

    // Route for getting all Posts from the db
    app.get("/posts", function (req, res) {
        // Grab every document in the Posts collection
        db.Post.find({})
            .then(function (dbPost) {
                // If we were able to successfully find Posts, send them back to the client
                res.json(dbPost);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for grabbing a specific Post by id, populate it with it's comment
    app.get("/posts/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Post.findOne({ _id: req.params.id })
            // ..and populate all of the comments associated with it
            .populate("comment")
            .then(function (dbPost) {
                // If we were able to successfully find an Post with the given id, send it back to the client
                res.json(dbPost);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Route for saving/updating an Post's associated Comment
    app.post("/posts/:id", function (req, res) {
        // Create a new comment and pass the req.body to the entry
        db.Comment.create(req.body)
            .then(function (dbComment) {
                // If a Comment was created successfully, find one Post with an `_id` equal to `req.params.id`. Update the Post to be associated with the new Comment
                return db.Post.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
            })
            .then(function (dbPost) {
                // If we were able to successfully update an Post, send it back to the client
                res.json(dbPost);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });
};