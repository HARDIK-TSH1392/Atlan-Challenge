const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/MarketResearch";

const connectToMongo = () =>{
    mongoose.set('strictQuery', false);
    mongoose.connect(mongoURI, () =>{
        console.log("Connected to Mongoose Successfully!")
    })
}

module.exports = connectToMongo;