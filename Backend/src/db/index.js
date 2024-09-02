import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        //console.log(connectionInstance)
        // console.log(`Database listening on port ${process.env.PORT}`)
    } catch (error) {
        console.log("MongoDB connection Failed",error);
        process.exit(1);
    }
}

export default connectDB;