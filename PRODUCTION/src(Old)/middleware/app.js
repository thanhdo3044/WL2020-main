const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const models = require("../../models");
//fix trả về 304
app.disable("etag");
const router = require("../controllers/router");
const path = require("path");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(
    require("api-formatter").Api.middleware(
        require("./../core/config").apiFormater
    )
);
app.use("/public", express.static(path.join(__dirname, "./../public")));
app.use("/ping", (req, res) => {
    res.status(200).send("pong").end();
});
app.use("/api/v2", router);
app.use("/api/v3", router);

app.use((req, res) => {
    res.api.sendFail(require("./../core/config").getErrorMessage(404));
});

module.exports = app;