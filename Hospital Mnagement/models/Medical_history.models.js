import mongoose from 'mongoose';
import { hospital } from './Hospital.models';
import { doctor } from './Doctor.models';

const medical_HistorySchema = new mongoose.Schema({
    prev_disease:{
        type:String,
        required:true
    },

    prev_diagonised_at:{
        type:mongoose.Schema.Types.ObjectId,
        ref:hospital
    },

    treatment_name:{
        type:String,
        required:true,
        loercase:true
    },

    doctor_assigned:{
        type:mongoose.Schema.Types.ObjectId,
        ref:doctor
    }
},{timestamps:true})
export const record = mongoose.model("record",medical_HistorySchema)