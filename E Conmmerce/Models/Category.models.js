import mongoose from 'mongose';
const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    }
},{timestamps:true})
export const Category = mongoose.model("Category",categorySchema)