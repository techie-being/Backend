import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();


const connectionURL = process.env.mongoURL;



const connectDB = async () => {
    try {
        // This line prints the URL so you can verify it looks correct in the terminal
        console.log("Attempting to connect with:", connectionURL); 
        
        await mongoose.connect(connectionURL);
        console.log("✅ Success! Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting:", error);
    }
    process.exit(0); 
}

connectDB();