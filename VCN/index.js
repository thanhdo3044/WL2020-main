require("dotenv").config();
require("dotenv").config({
  path: require("path").join(__dirname, "./../.env")
});
var sql = require("mssql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require('./models')

const router = express.Router();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(cors());
app.use("/", bodyParser.json());
app.use(
    require("api-formatter").Api.middleware(
        require("./config/global").apiFormater
    )
);

const environment = process.env.NODE_ENV; // development
if (environment !== "production") {
    const logger = require("morgan");
    app.use(logger("dev"));
    // and this
    app.use("/", logger("dev"));
}

app.use("/ping", (req, res) => {
    res.status(200).send("Pong");
});

const routes = require("./controller/customer");
app.use("/api/v1/vcn", routes);
app.use("/api/v2/vcn", routes);
const port = 1030;

app.listen(port, () => console.log(`🚀 Server ready at http://localhost:1030`));