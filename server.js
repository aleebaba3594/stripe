const express = require("express");
const bodyParser = require("body-parser");
const DBConnection = require("./config/db");
const color = require("colors");
//env
require("dotenv").config();
// stripe
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var cors = require("cors");
//order model using mongoose odm
const Order = require("./models/orders");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// db connection
DBConnection();
app.use(cors());

//payment route
app.post("/payment", async (req, res) => {
  let status, error, dataReturned;
  const { token, amount } = req.body;
  try {
    dataReturned = await Stripe.charges.create({
      source: token.id,
      amount: amount,
      currency: "usd",
    });
    status = "success";
  } catch (error) {
    console.log(error);
    status = "Failure";
  }
  //saving data in database
  const newOrder = new Order({
    amount: dataReturned.amount / 100,
    currency: dataReturned.currency,
    status: dataReturned.status,
    shopId: dataReturned.id,
  });
  await newOrder.save();
  res.json({ error, status, dataReturned });
});

//api to track transaction
app.post("/track-transaction", async (req, res) => {
  const dataToSearch = await Order.find({ shopId: req.body.trackinId });
  if (dataToSearch.length > 0) {
    res.send(dataToSearch);
  } else {
    res.send({ status: "not found" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`server is up at ${PORT}`.cyan.bold);
});
