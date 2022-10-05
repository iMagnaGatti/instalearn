if(process.env.NODE_ENV !=='production')
{
    require('dotenv').config()
}
const express= require('express')
const app=express()
const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const jsonParser=bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: true })

mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})
const db=mongoose.connection
db.on('error',error=>console.error(error))
db.once('open',()=>console.error('Connected to mongoose'))
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.post('/signup',express.json(),(req,res)=>{
    console.log(req.body);
    const nome=req.body.nome;
    const cognome=req.body.cognome;
    const email=req.body.email;
    const password=req.body.password;
    db.collection('users').insertOne(
        {
            nome:nome,
            cognome:cognome,
            email:email,
            password: password
        }
    );
    res.sendStatus(200);
})

app.listen(process.env.PORT||3000)