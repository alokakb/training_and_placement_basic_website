const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const conn = require("../db/conn");

// defining schema for student user
const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },

    psw : {
        type: String,
        required: true
    },

    psw_repeat : {
        type: String,
        required: true
    },

    tokens: [{
            token: {
                type:String,
                required:true
            }
        }]
});

//generate json webtoken
userSchema.methods.generateAuthToken = async function() {
    try {
        console.log(this._id);
        const tokenVar = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        console.log(tokenVar);
        this.tokens = this.tokens.concat({token: tokenVar});
        await this.save();
        return tokenVar;
        
    } catch (error) {
        res.send("the error part" + error);
        console.log("the error part " +error);
    }
}

// student user password modification
userSchema.pre("save", async function(next) {

    if(this.isModified("psw")){
        this.psw = await bcrypt.hash(this.psw, 10);
        this.psw_repeat = await bcrypt.hash(this.psw_repeat, 10);
        // this.psw_repeat = undefined;
    }

    next();
});


// creating the collections
const Register = new mongoose.model("Register", userSchema);


//exporting the data
module.exports = Register;
