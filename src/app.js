require('dotenv').config();
const express = require("express");
const path = require('path');
const app = express();
const fs = require("fs");
const { Agent } = require("http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");
const auth_comp = require("./middleware/auth_comp")


require("./db/conn");
// require("./db/conn2");

const Register = require("./models/registers");
const compRegister = require("./models/compRegisters");


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
res.render("project");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
    });

    app.get("/studentlogout", auth, async(req, res) =>{
        try {
            // console.log(req.user)

            // single logout
            // req.user.tokens= req.user.tokens.filter((currelement)=>{
            //     return currelement.token!=req.token
            // })

            //logout from all devices
            req.user.tokens=[];      //clear tokens from database

            res.clearCookie("jwt");      // clear cookies from browser
            console.log("logout successfully")
            

            await req.user.save();
            // alert("you have been logged out")
            res.render("project")
            
        } catch (error) {
            res.status(500).send(error);
        }

    })

    app.get("/companylogout", auth_comp, async(req, res) =>{
        try {
            // console.log(req.user)

            // single logout
            // req.user.tokens= req.user.tokens.filter((currelement)=>{
            //     return currelement.token!=req.token
            // })

            //logout from all devices
            req.user.tokens=[];      //clear tokens from database

            res.clearCookie("jwt");      // clear cookies from browser
            console.log("logout successfully")
            

            await req.user.save();
            // alert("you have been logged out")
            res.render("project")
            
        } catch (error) {
            res.status(500).send("error is here");
        }

    })

    app.get("/compRegister", (req, res) => {
        res.render("compRegister");
    });

    app.get("/compLogin", (req, res) => {
        res.render("compLogin");
    });

    app.get("/procedure", (req, res) => {
        res.render("procedure");
        });

    app.get("/uploadCV", auth, (req, res) => {
        console.log(`this is the cookie awesome ${req.cookies.jwt}`);
        res.render("uploadCV");
        });


        // app.post("/uploadCV", (req, res) => {
        //     const data = req.body.uploadCVdoc;
        //     mongo.insert({file: data});
            
        //     });

// create a new student user in our datbase
app.post("/register", async (req, res) => {
    try{
        const password = req.body.psw;
        const cpassword = req.body.psw_repeat;

        if(password === cpassword){
            const registerUser = new Register({
                email : req.body.email,
                psw : req.body.psw,
                psw_repeat : req.body.psw_repeat

            })
            
           console.log("the success part" + registerUser);
           
           const token = await registerUser.generateAuthToken();
           console.log("the token part" + token);

           // The res.cookie() function is used t set the cookie name to value.
           // The value parameter may be a string or object converted to JSON.

           res.cookie("jwt", token, {
               expires:new Date(Date.now() + 30000),
               httpOnly:true
           });

           const registered = await registerUser.save();
           console.log("the page part" + registered);

           res.status(201).render("project");

        } 
        
        else{
            res.send("password not matching");
        }
         
    } catch(error) {
        res.status(400).send(error);
        console.log("the error part page");
    }
});

// create a new company user in our db
app.post("/comp_register", async (req, res) => {
    try{
        const password = req.body.comp_psw;
        const cpassword = req.body.comp_psw_repeat;

        if(password === cpassword){
            const registerUser = new compRegister({
                comp_email : req.body.comp_email,
                comp_psw : req.body.comp_psw,
                comp_psw_repeat : req.body.comp_psw_repeat

            })

           const registered = await registerUser.save();
           res.status(201).render("project");

        } else{
            res.send("password not matching");
        }
         
    } catch(error) {
        res.status(400).send(error);
    }
});

// checking login credentials

app.post("/login", async(req, res) =>{

    try{
        const typed_email = req.body.uname;
        const typed_password = req.body.psw;

        const useremail = await Register.findOne({email:typed_email});

        const isMatch = await bcrypt.compare(typed_password, useremail.psw);

        const token = await useremail.generateAuthToken();
           console.log("the token part" + token);
           
           
           res.cookie("jwt", token, {
            expires:new Date(Date.now() + 120000),
            httpOnly:true
            //secure:true
        });



        if(isMatch){
            console.log("login successful");
            res.status(201).render("project");
        }
        else{
            res.send("invalid login details");
        }

    } catch {
        res.status(400).send("invalid login details")
    }
})

app.post("/compLogin", async(req, res) =>{

    try{
        const typed_email = req.body.comp_uname;
        const typed_password = req.body.comp_psw;

        const useremail = await compRegister.findOne({comp_email:typed_email});

        const isMatch = await bcrypt.compare(typed_password, useremail.comp_psw);

        const token = await useremail.generateAuthToken();
           console.log("the token part" + token);
           
           
           res.cookie("jwt", token, {
            expires:new Date(Date.now() + 120000),
            httpOnly:true
            //secure:true
        });



        if(isMatch){
            console.log("login successful");
            res.status(201).render("project");
        }
        else{
            res.send("invalid login details");
        }

    } catch {
        res.status(400).send("error here")
    }
})


// // password secure by hashing
// const bcrypt = require("bcryptjs");

// const securePassword = async (pass) => {

//     const passwordHash = await bcrypt.hash(pass, 10);
//     console.log(passwordHash);

//     const passwordmatch = await bcrypt.compare( pass , passwordHash);
//     console.log(passwordmatch);
// }

// securePassword("akb");


// // generate json webtoken example
// const jwt = require("jsonwebtoken");

// const createToken = async() => {
//     const token = await jwt.sign({_id: "61aa1a1959990873deb11838"}, "mynameisalokkumarbharti", {
//         expiresIn: "2 minutes"
//     });

//     console.log(token);

//     const userVerification = await jwt.verify(token, "mynameisalokkumarbharti");
//     console.log(userVerification);
// }

// createToken();



app.listen(port, ()=> {
    console.log(`server is running at port ${port}`);
})