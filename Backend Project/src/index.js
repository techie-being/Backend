import dotenv from 'dotenv';


// This forces Node to look for the .env file in the absolute root of your project
dotenv.config({
    path:'./.env'
});
import connectDB from './db/Index.js';
import { app } from './app.js'
// require ('dotenv').config({path:"./env"})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at ${process.env.PORT }`);
    })
})
.catch((err)=>{
    console.error("database does not connected successfully",err);
})









/*import mongoose from 'mongoose';
import {DB_NAME} from './constants';

import express from 'express';
const app = express();

iipy syntax
;( async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
        app.on("error",(error)=>{
            console.log('ERROR',error);
            throw err;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listenning at ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("error",error);
        throw error;      
    }

})()   */