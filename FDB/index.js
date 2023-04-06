var sql = require("mssql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();


const router = express.Router();
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(cors());
app.use("/", bodyParser.json());

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

const routes = require("./routes/index.js");
app.use("/api/v1", routes(router));
app.use("/api/v2", routes(router));
const port = 1020;

app.listen(port, () => console.log(`🚀 Server ready at http://localhost:1020`));