// Dependencies - modules
var express = require("express");
var mongoose = require("mongoose");
var multer = require("multer");
var path = require("path");
var csvModel = require("./models/csv");
var csv = require("csvtojson");
var bodyParser = require("body-parser");
//for environment access
require("dotenv").config();

// multer storage function
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var uploads = multer({ storage: storage });

//connection to database
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(err));
var app = express();

//set the template engine
app.set("view engine", "ejs");

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));

// express static file
app.use(express.static(path.resolve(__dirname, "public")));
// port
var port = process.env.PORT || 3000;
//main page
app.get("/", (req, res) => {
  csvModel.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data != "") {
        res.render("demo", { data: data });
      } else {
        res.render("demo", { data: "" });
      }
    }
  });
});

var temp;
// Uploading the csv file to db
app.post("/", uploads.single("csv"), (req, res) => {
  //converting the csvfile to jsonArray
  csv()
    .fromFile(req.file.path)
    .then((jsonObj) => {
      csvModel.insertMany(jsonObj, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    });
});

// Listening to the port
app.listen(port, () => console.log("app running at port no : " + port));
