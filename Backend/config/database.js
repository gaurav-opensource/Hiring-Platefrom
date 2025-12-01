const mongoose = require('mongoose');
require('dotenv').config(); 

//connect mongodb database
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
       
        });
        console.log(`MongoDB successfully connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`); 
        process.exit(1);
    }
};


module.exports = connectDB;