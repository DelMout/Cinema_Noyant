require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet"); // Protect HTTP headers
const app = express();

// Routes
const subRoutes = require("./routes/subscriber");

// Models
const { subscriber } = require("./models");

//* **** API routes ****
//  * User
app.use("/api/subscriber", subRoutes);

app.use(cors()); // Security CORS
app.use(bodyParser.json());
app.use(helmet());

module.exports = app;
