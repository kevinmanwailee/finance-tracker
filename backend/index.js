
const express = require('express');
const app = express();
const cors = require('cors');
const { ObjectId, MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const port = 9000;
const host = 'http://127.0.0.1:' + port;

// Use Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use CORS middleware
app.listen(port, ()=> console.log("Running on: " + host));
app.use(cors());

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
app.get('/', function(req, res, next){
    res.send('Hi');
})

// GET ALL
app.get('/transactions', async(req,res)=>{
    const result = await db.find().sort({date: -1}).toArray();
    res.send(result);
    console.log("GET ALL called");
    console.log(result);
})

// GET ONE - id
app.get('/transactions/id/:id', async(req,res)=>{
    let id = req.params.id;
    const result = await db.find(new ObjectId(id)).toArray();
    res.send(result);
})

// GET ONE - title
app.get('/transactions/title/:title', async(req,res)=>{
    let title = req.params.title;
    const result = await db.find({"title":title}).toArray();
    res.send(result);
})

// GET ALL - month/year
app.get('/transactions/dateMY/:month/:year', async(req,res)=>{
    var currMonth = req.params.month;
    if(currMonth.length == 1){
        currMonth = "0"+currMonth;
    }
    let searchDate = currMonth + "/" + req.params.year;
    const result = await db.find().toArray();

    for(let i = 0; i < result.length; i++){
        let currDate = (result[i].date);
        currDate = currDate.substring(0, 3) + currDate.substring(6, currDate.length);
        if(currDate != searchDate){
            result.splice(i, 1)
            i--; // fix index after removing element from array
        }
    }
    res.send(result);
}) 

// GET ALL - month/year categories array
app.get('/transactions/categoryArray/:month/:year', async(req,res)=>{
    var currMonth = req.params.month;
    if(currMonth.length == 1){
        currMonth = "0"+currMonth;
    }
    let searchDate = currMonth + "/" + req.params.year;
    const result = await db.find().toArray();

    var food = 0;
    var income = 0;
    var recreation = 0;

    for(let i = 0; i < result.length; i++){
        let currDate = (result[i].date);
        currDate = currDate.substring(0, 3) + currDate.substring(6, currDate.length);
        if(currDate === searchDate){
            console.log(result[i])
            if(result[i].category === "Food"){
                food = Number(food) + Number(result[i].price);
            } else if(result[i].category === "Recreation"){
                recreation = Number(recreation) + Number(result[i].price);
                console.log(result[i])
            } else if(result[i].category === "Income"){
                income = Number(income) + Number(result[i].price);
            }
        }
    }

    // PLACEHOLDER. CHANGE WHEN REMAINING IS ADDED
    var tempResult = { type:'', Food:food, Recreation:recreation, Remaining:200};
    // console.log(tempResult);
    res.send(tempResult);
}) 

// PUT - Add post 
app.put('/AddTransaction/', async(req,res)=>{
    try{
        const result = await db.insertOne(req.body);
        console.log(req.body);
        res.send(result);
    } catch(err){
        console.error(err);
    }
})

// DELETE - Delete post
app.delete('/Delete/:id', async(req,res)=>{
    let id =  req.params.id;
    console.log("DELETE:  " + id);
    try{
        const result = await db.deleteOne({"_id": new ObjectId(id)});
        console.log(result);
        res.send(result);
    }catch(err){
        console.error(err);
    }
})