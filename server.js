const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");

const express = require("express");
const app = express();

app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static(process.cwd() + "/public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/webscraper");
const db = mongoose.connection;

db.on("open", function() {
db.on("error", console.error.bind(console, "connection error:"));
    console.log("Connected to Mongoose!");
});


const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Connected to PORT " + port + "  http://localhost:" + port);
})