import connectDB from './db/Index.js';
import dotenv from 'dotenv';
// require ('dotenv').config({path:"./env"})
dotenv.config({
    path:"./env"
})

connectDB();










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