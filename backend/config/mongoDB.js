import mongoose from "mongoose";

const connectDB = async () => {
  const DB = process.env.MONGO_URI;
  mongoose.connection.on("connected", () =>
    console.log("Connected to The MongoDB database -------->")
  );
  mongoose.connect(DB);
};

export default connectDB;
