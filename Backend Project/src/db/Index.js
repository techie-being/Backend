import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js';

const connectDB = async ()=>{
    try {
        //mongoose retuerns object so we can store it in a instance
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        console.log(`database is trying to connect to host: ${connectionInstance.connection.host}`);
        console.log("database is succesfullly connected");
        
    } catch (error) {
        console.error("mongoDB connection ERROR",error);
        process.exit(1);
        
    }
}
export default connectDB