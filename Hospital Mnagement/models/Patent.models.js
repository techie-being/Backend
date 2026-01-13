import mongoose from 'mongoose';
import { record } from './Medical_history.models';
import { hospital, Hospital } from './Hospital.models';
const patientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true
    },

    contact:{
        typ:Number,
        required:true,
    },

    //we can make a another adress scema for this adress requirement and give a ref here
    address:{
        type:string,
        required:true
    },
    
    diagonised_with:{
        type:String,
        required:true
    },

    med_History:{
        trype:mongoose.Schema.Types.ObjectId,
        ref:record
    },

    admitted_at:{
        type:mongoose.Schema.Types.ObjectId,
        ref:hospital
    },

    age:{
        type:Number,
        required:true,
    },

    blood_group:{
        type:String,
        required:true
    },

    gender:{
        type:String,
        enum:["M","F","others"],
        required:true
    },












},{timestamps:true})
export const patient = mongoose.model("patient",patientSchema)