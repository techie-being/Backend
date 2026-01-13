import mongoose from 'mongoose';
const hospitalSchema = new mongoose.Schema({
    name:{
        type:string,
        required:true
    },

    addressline1:{
        type:string,
        required:true
    },

    addressline2:{
        type:string,
    },

    pincode:{
        type:String,
        require:true
    },

    specialised:[
        {
            type:String,
        }
    ],
},{timestamps:true})
export const hospital = mongoose.model("hospital",hospitalSchema)