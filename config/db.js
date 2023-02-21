let mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://aleebaba3594:testingdb@cluster0.x08hw.mongodb.net/stripe_DB?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.yellow.underline);
  } catch (err) {
    console.log(`MongoDB Not connected: ${err}`);
    process.exit(1);
  }
};

module.exports = connectDB;
