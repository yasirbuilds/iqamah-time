import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log(`Connected to DB ${mongoose.connection.host}`);
  } catch (error) {
    console.log("DB Error", error);
  }
};

export default connectDb;
