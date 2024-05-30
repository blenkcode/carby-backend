const mongoose = require("mongoose");
const cloudinaryURL = process.env.CLOUDINARY_URL;
const connectionString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Database connected"))
  .catch((error) => console.error(error));
module.exports = {
  cloudinaryURL,
};
