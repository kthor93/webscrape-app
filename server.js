const express = require("express");
const mongoose = require("mongoose");

const PORT = 3000;

// Initialize Express
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/webscrape-app", { useNewUrlParser: true });

// Routes
// require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});
