import mongoose from "mongoose";
require('dotenv').config();

const dbUsername = process.env.DB_USERNAME || '';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const authSource = process.env.DB_AUTH_SOURCE || 'admin';

// Construct the MongoDB URI
// const dbUri = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

const dbUri = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=${authSource}&authMechanism=DEFAULT`;



//const dbUrl:string = process.env.DB_URI || '';

const connectDB = async () => {
    try{
        await mongoose.connect(dbUri).then(()=> {
            console.log("Database connected");
        })
    }catch(e:any){
        console.log(e.message);
        setTimeout(connectDB,5000);
    }
}

export default connectDB;