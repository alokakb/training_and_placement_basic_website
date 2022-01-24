const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const conn2 = require("../db/conn");
const jwt = require("jsonwebtoken");

// defining company user schema
const companySchema = new mongoose.Schema({
    comp_email : {
        type: String,
        required: true,
        unique: true
    },

    comp_psw : {
        type: String,
        required: true
    },

    comp_psw_repeat : {
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
companySchema.methods.generateAuthToken = async function() {
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

// password modification for company user
companySchema.pre("save", async function(next) {

    if(this.isModified("comp_psw")){
        this.comp_psw = await bcrypt.hash(this.comp_psw, 10);
        this.comp_psw_repeat = await bcrypt.hash(this.comp_psw_repeat, 10);
        // this.comp_psw_repeat = undefined;
        
    }

    next();
});

// creating the collections
const compRegister = conn2.companyRegistration.model("compRegister", companySchema);

//exporting the data
module.exports = compRegister;
