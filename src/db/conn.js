const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27017/userRegistration").then(() => {
    console.log(`connection to userRegistratiob db successful`);
}).catch((e) =>{
    console.log(`no connection`);
})

mongoose.companyRegistration = mongoose.createConnection('mongodb://localhost:27017/companyRegistration');

module.exports = mongoose;
// getting-started.js


// main().then(()=> { console.log("connection successful")}).catch(err => console.log("connecton unsuccessful"));

// async function main() {
//   await mongoose.connect('mongodb://localhost:27017/userRegistration');
// }