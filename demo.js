var express = require('express')
var hbs = require('hbs')


var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine','hbs')

var url = 'mongodb://localhost:27017';
var MongoClient = require('mongodb').MongoClient;

app.get('/', async (req, res) => { 
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let results = await dbo.collection("product").find({}).toArray();
    res.render('index', { model: results })
})


app.post('/search', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let nameInput = req.body.txtName; 
    let searchCondition = new RegExp(nameInput)
    let results = await dbo.collection("product").find({ name: searchCondition }).toArray();
    res.render('index', { model: results })
})

app.get('/insert',(req,res)=>{
    res.render('newproduct')
})

app.post('/doInsert', async (req,res)=>{
    var numberInput = req.body.txtNumber;
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newProduct = {number:numberInput, name:nameInput, price:priceInput};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    await dbo.collection("product").insertOne(newProduct);
    res.redirect('/')
})

app.get('/home',(req,res)=>{
    res.render('index')
})

app.get('/edit',(req,res)=>{
    res.render('edit')
})

app.post('/SearchEdit', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let nameInput = req.body.txtName; 
    let searchCondition = new RegExp(nameInput)
    let results = await dbo.collection("product").find({ name: searchCondition }).toArray();
    res.render('edit', { model: results })
})

app.get('/editInfor',async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let productToEdit = await dbo.collection("product").findOne(condition);
    res.render('editInfor',{product:productToEdit})
})

app.post('/update',async (req,res)=>{
    let id = req.body.txtId;
    let numberInput = req.body.txtNumber;
    let nameInput = req.body.txtName;
    let priceInput = req.body.txtPrice;
    let newValues ={$set : {number: numberInput, name: nameInput, price:priceInput}};
    var ObjectID = require('mongodb').ObjectID;
    let condition = {"_id" : ObjectID(id)};   

    let client= await MongoClient.connect(url);
    let dbo = client.db("ATN");
    await dbo.collection("product").updateOne(condition,newValues);
    res.redirect('/');
})

app.get('/delete',(req,res)=>{
    res.render('delete')
})

app.post('/SearchDelete', async (req, res) => {
    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN");
    let nameInput = req.body.txtName; 
    let searchCondition = new RegExp(nameInput)
    let results = await dbo.collection("product").find({ name: searchCondition }).toArray();
    res.render('delete', { model: results })
})

app.get('/deleteInfor', async (req,res)=>{
    let id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    let condition = {'_id' : ObjectID(id)};

    let client = await MongoClient.connect(url);
    let dbo = client.db("ATN");
    await dbo.collection("product").deleteOne(condition);
    res.redirect('delete')
})

app.listen(5000)
console.log('Server is running!')