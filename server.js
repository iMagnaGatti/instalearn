if(process.env.NODE_ENV !=='production')
{
    require('dotenv').config();
}

const express= require('express');
const app=express();
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
var CryptoJS = require("crypto-js");
const cors = require('cors');
var corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {;
        callback(new Error('Not allowed by CORS'));
      }
    }
  }
const helmet = require('helmet');
const sanitizer = require('sanitizer');
const rateLimit = require("express-rate-limit");
const port = process.env.PORT || 3000;
var ObjectId=mongoose.Types.ObjectId;
const _secretKey = process.env.SECRET_KEY; //key for create hash key 
const urlencodedParser = bodyParser.urlencoded({ extended: true });
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true});
const db=mongoose.connection;


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
app.use(helmet());
app.use(express.static('.'));
//app.use(cors(corsOptions));
app.use(rateLimit({windowMs: 10 * 60 * 1000, max: 100}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 



app.post('/signup',express.json(),async (req,res)=>{
    console.log(req.body);
    const nome=req.body.nome;
    const cognome=req.body.cognome;
    const email=req.body.email;
    //const password=createHashPwd(req.body.password);
    
    const risulatato=(await db.collection("users").findOne({email:email}))
    if(risulatato){

        res.sendStatus(505);
    }else{
        const password=CryptoJS.AES.encrypt(req.body.password,_secretKey).toString();
        db.collection('users').insertOne(
            {
                nome:nome,
                cognome:cognome,
                email:email,
                password: password
            }
        );
        res.sendStatus(200);
    }

})
app.post('/login',express.json(),async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const ris=await db.collection('users').findOne({email:email});
    if(ris){
        const decriptata=CryptoJS.AES.decrypt(ris.password,_secretKey).toString(CryptoJS.enc.Utf8);
        if(decriptata==password){
        res.send({id: ris._id});
        }
        else
        res.sendStatus(500);
    }
    else{
        res.sendStatus(500);
    }
});
app.post('/cercaInsegnante',express.json(),async (req,res)=>{
    const topic_id=req.body.topic_id;
    const skill=req.body.skill;
    const user_id=req.body.user_id;
    const ris=await db.collection('skills').find({topic_id:topic_id,user_id:{$ne:user_id}});
    if(ris)
    {
        var arr=[];
        const risultati=await ris.toArray();
        for await (const doc of risultati)
        {
            
            const tot=await db.collection('users').findOne({_id:new ObjectId(doc.user_id)});
            
            if(tot)
            {
                await arr.push({username:tot.username,rank:doc.rank});
                //console.log(arr);
            }

        };
        //console.log(arr);
        res.send(arr);
    }
    else
    res.sendStatus(500);

});





app.listen(port)