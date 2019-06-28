const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webscrape-app";

mongoose.connect(MONGODB_URI);
mongoose.connect("mongodb://localhost/webscrape-app", { useNewUrlParser: true });

// Routes
require("./routes/api-routes.js")(app);

// Server Start
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});
