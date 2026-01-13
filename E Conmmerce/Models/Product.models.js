import mongoose from 'mongoose';
const productSchema = mongoose.Schema({
    descreption:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    productimage:{
        type:string,
    },

    price:{
        type:Number,
        default:0,
    },

    stock:{
        type:Number,
        default:0
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

    //instead of owner it must be seller a different file for sellers only and ref must be seller not user itself
},{timestamps:true})
export const Product = mongoose.model("Product",productSchema)