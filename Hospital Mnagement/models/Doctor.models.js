import mongoose from 'mongoose';
import { hospital } from './Hospital.models';

const doctor_work_schema = {
    Hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:hospital
    },
    hours:{
        type:Number,
        require:true
    }
}

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true
    },

    salary:{
        type:Number,
        required:true
    },

    qualifications:{
        type:String,
        required:true,
    },

    experience:{
        type:Number,
        default:0
    },

    work_in_hospital:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:hospital
        },
    ],

    department:{
        type:String,
        required:true,
    },

    work_in_hour:{
        type:[doctor_work_schema],
        required:true
    }


},{timestamps:true})
export const doctor = mongoose.model("doctor",doctorSchema)