import connectdb from './db/index.js';
import dotenv from 'dotenv';

dotenv.config({
    path:"./env"
})
//dotenv configs tell that env is is in root directiory inside env so it can immediately available after just import
connectdb()

.then(()=>{
    app.on("error",(error)=>{
        console.log("error",error);
    });

    app.listen(process.env.PORT || 3000,()=>{
        console.log(`server is running at port ${process.env.PORT}`)
    });
})

.catch((error)=>{
    console.log("MONGODB conection failed!!!",error);
})

/*
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from "express";
const app = express();

// Approach 1: Connect DB immediately in index.js using IIFE
;( async () => {
    try {
        // 1. Attempt connection
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        
        // 2. Handle listeners (Optional but professional)
        // Just because DB is connected, doesn't mean Express can talk to it.
        app.on("error", (error) => {
            console.log("ERRr: ", error);
            throw error
        })

        // 3. Start the server
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})() */
