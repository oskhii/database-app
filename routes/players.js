//Enables express
var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

//Enables body parser
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Enables mongoose
var mongoose = require("mongoose");

//Enables dotenv
require("dotenv").config();

//Imports mongoose schema from player.js
var PlayerProfile = require("../models/player");

//Gets username and password from the dotenv file
var user = process.env.MONGO_USERID
var password = process.env.MONGO_PASSWORD

//Creates the uri for connecting to the database
const uri = "mongodb+srv://" + user + ":" + password + "@cluster0.9w0cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//Connects to the database
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

//Get all function
app.get("/api/getall", function(req, res) {
    PlayerProfile.find({}, null, function(err, results) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            //console.log(results);
            res.status(200).json(results);
        };
    });
});

//Get by id- function
app.get("/api/:id", function(req, res) {
    var id = req.params.id;
    PlayerProfile.findById(id, function(err, results) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        //Different error message if the id is a possible one but not correct
        } else if (results == null) {
            res.status(404).json({
                error: "Cannot be fetched as object cannot be found (invalid id)."
            });
        } else {
            console.log(results);
            res.status(200).json(results);
        };
    });
});

//Post function
app.post("/api/add", function(req, res) {
    //Uses the imported mongoose schema "PlayerProfile"
    var newPlayer = new PlayerProfile({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        birthday: req.body.birthday,
        height: req.body.height,
        nationality: req.body.nationality
    });
    newPlayer.save(function(err, results) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        } else {
            console.log("Added: " + results);
            res.status(200).json({
                message: "Added " + req.body.name,
                results
            });
        };
    });
});

//Modify by id- function
app.put("/api/update/:id", function(req, res) {
    var id = req.params.id;
    PlayerProfile.findByIdAndUpdate(id, {$set: req.body}, {new: true}, function(err, results) {
        if(err) {
            console.log(err);
            res.status(500).json(err);
        //Different error message if the id is a possible one but not correct
        } else if (results == null) {
            res.status(404).json({
                error: "Cannot be updated as object cannot be found (invalid id)."
            });
        } else {
            console.log("Updated: " + results);
            res.status(200).json("Updated id " + id + ": " + results.name);
        };
    });
});

//Delete by id- function
app.delete("/api/delete/:id", function(req, res) {
    var id = req.params.id;
    PlayerProfile.findByIdAndDelete(id, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).json(err);
        //Different error message if the id is a possible one but not correct
        } else if (results == null) {
            res.status(404).json({
                error: "Cannot be deleted as object cannot be found (invalid id)."
            });
        } else {
            console.log("Deleted: " + results);
            res.status(200).json("Deleted id " + id + ": " + results.name);
        }
    });
});

//Sends error message in case the user navigates to path which doesn't exist
app.get("*", function (req, res) {
    res.status(404).json({
        error: "Error, cannot find page!"
    });
});

//Enables sever
var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    //Sends a message in the console that the server is running
    console.log("Example app is listening on port %d", PORT);
});
