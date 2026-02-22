import mongoose, {Schema} from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowwercase:true,
        trim:true,
        // if we want to enable search on any field we use index:true
        index:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowwercase:true,
        trim:true,
    },

    fullname:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },

    avatar:{
        type:String,  //cloudniary url retuirn a url of stored image on cloud
        required:true
    },

    coverImage:{
        type:String,
    },

    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],

    password:{
        type:String,
        required:[true, 'password is required'],
    },

    refreshToken:{
        type:String,
    }
},{
    tiestamps:true,
})

//we use bcrypt here to acces users details using this password inside function  
//to hash /encypt password  while storing in db for security purposes
userSchema.pre("save",(async function(next) {
    //pre is a hook of bcrypt package used to execute a code before saving or just after saving 
    if(!this.isModified("password")) return next;
    this.password = await bcrypt.hash(this.password,10)
    // next()
    //next is used to pass this event to next
    
}))

//add some mongoose methods(object in mongoose) to check whether users password matchs with hashed passowrd in database
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

//custom methods as above one to create refreshtoken and acesstoken

//short term expiry

userSchema.methods.generateAccessToken = function() {
    
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY;

    if (!secret) {
        throw new Error("Missing ACCESS_TOKEN_SECRET in environment variables");
    }

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        secret,
        {
            expiresIn: expiry
        }
    );
};

//long term expiry
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)   
}
export const User = mongoose.model("User",userSchema)
