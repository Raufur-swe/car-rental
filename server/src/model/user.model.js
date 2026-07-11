// user model for admin , customer and vendor

import mongoose from "mongoose"
import bcrypt from "bcrypt"

// design schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is require for registration"],
        trim: true,
        minlength: 2,
        maxlength: 60,
    },
    email: {
        type: String,
        required: [true, "email is require for registration"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
         match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
        type: String,
        required: [true, "phone is require for registration"],
        trim: true,
        index: true,
        unique: true,
    },
    nid: {
        type: String,
        required: [true, "nid number is require for registration"],
        trim: true,
        index: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, " password is require for registration"],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ["customer", "owner", "admin"],
        default: "customer",
        index: true,
    },
    totalSpent :{
        type : Number ,
        default : 0
    },
    myrents : {
        type : Number,
        default : 0 
    },
    profileImage: {
        type: String,
        default: null,
        trim: true
    },
    address: {
        type: String,
        default: "",
        index: true,
        trim: true,
        maxlength: 250,

    },
     isVerified: {
        type: Boolean,
        default: false,
        index: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
        index: true,
    }
   
}, { timestamps : true })

// hash the pass

userSchema.pre("save" , async function(){
    if(!this.isModified("password")) 
        return 
    this.password = await bcrypt.hash(this.password , 12)
})

// comapair pass
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password , this.password)
}

// hide pass from db

userSchema.methods.toJSON = function(){
    const user = this.toObject();

    delete user.password;

    return user
}


const User = mongoose.model("user" , userSchema);

export default User ;