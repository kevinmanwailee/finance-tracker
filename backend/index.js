const express = require('express');
const app = express();
const cors = require('cors');
const {MongoClient} =require('mongodb');

const corsOptions = {
    origin: 'http://localhost:3000',
    // origin: 'http://192.168.0.12:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};

const port = 9000;
const host = 'http://127.0.0.1:' + port;

// Use CORS middleware
app.listen(port, ()=> console.log(host));
app.use(cors(corsOptions));


// MongoDB Connection
const mongodbURL = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(mongodbURL);

let db = null;

(async function connect(database='mydb', collection='transactions'){
    try{
        const conn = await client.connect();
        const dbconnect = await conn.db(database);
        db = await dbconnect.collection(collection);
    } catch(err) { console.log(err) };
    return null;
})() // IIFE


// API
app.get('/',(req,res)=>{
    res.send('Hi');
})

// GET ALL
app.get('/transactions', async(req,res)=>{
    const result = await db.find().toArray();
    res.send(result);
})

// GET ONE - id
app.get('/transactions/id/:id', async(req,res)=>{
    let id = Number(req.params.id);
    const result = await db.find({"id":id}).toArray();
    res.send(result);
})

// GET ONE - title
app.get('/transactions/title/:title', async(req,res)=>{
    let title = req.params.title;
    const result = await db.find({"title":title}).toArray();
    res.send(result);
})