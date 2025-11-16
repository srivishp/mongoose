const path = require("path");
//# Mongoose is to MongoDB what Sequelize is to SQL
//* Eases our work by letting us focus on our data and code rather than the database & its commands
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const app = express();
const User = require("./models/user");
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
//const User = require("./models/user");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// #Creating a middleware to fetch a user and use it in requests
//-> This is run only for incoming requests & not during npm start

app.use((req, res, next) => {
  User.findById("6919cd45d0ee26caa306dc6c") // User created in MongoDB
    .then((user) => {
      // handling the user's cart details along with his name and email
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://srivishp:Mongo2026@cluster0.1p7s5t7.mongodb.net/shop?appName=Cluster0"
  )
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Psv",
          email: "psv@test.com",
          cart: { items: [] },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));
