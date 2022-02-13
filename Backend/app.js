require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet"); // Protect HTTP headers

// const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const subscriberRoutes = require("./routes/subscriber");
const volunteerRoutes = require("./routes/volunteer");
const sessionRoutes = require("./routes/session");
// const producerRoutes = require("./routes/producer");
// const categoryRoutes = require("./routes/category");
// const orderRoutes = require("./routes/order");
// const infoRoutes = require("./routes/information");

// Models
// const { user } = require("./models");
const { product } = require("./models");
const { subscriber } = require("./models");
const { volunteer } = require("./models");
const { session } = require("./models");
// const { producer } = require("./models");
// const { category } = require("./models");
// const { order } = require("./models");
// const { information } = require("./models");

//association tables user/order et product/order
// order.belongsTo(user);
// module.exports = { user, order };
// order.belongsTo(product);
// module.exports = { product, order };

//association tables producer/product et category/product
// product.belongsTo(producer);
// module.exports = { producer, product };
// product.belongsTo(category);
// module.exports = { category, product };

app.use(cors()); // Security CORS

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

// **** ROUTES ****

//  * User
// app.use("/api/user", userRoutes);

// * Product
app.use("/api/product", productRoutes);

// * Subscriber
app.use("/api/subscriber", subscriberRoutes);

// * Volunteer
app.use("/api/volunteer", volunteerRoutes);

// * Session
app.use("/api/session", sessionRoutes);

// * Producer
// app.use("/api/producer", producerRoutes);

// * Category
// app.use("/api/category", categoryRoutes);

// // * Order
// app.use("/api/order", orderRoutes);

// * Information
// app.use("/api/information", infoRoutes);

// * Access images
app.use("/images/", express.static(path.join(__dirname, "images")));

module.exports = app;

// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const helmet = require("helmet"); // Protect HTTP headers
// const app = express();

// // Routes
// const productRoutes = require("./routes/product");

// // Models
// const { product } = require("./models");

// //* **** API routes ****
// //  * User
// app.use("/api/product", productRoutes);

// app.use(cors()); // Security CORS
// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(helmet());

// module.exports = app;
