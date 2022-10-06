if(process.env.NODE_ENV !=='production')
{
    require('dotenv').config()
}

const express= require('express')
const app=express()
const mongoose = require('mongoose')
const bodyParser=require('body-parser')
const bcrypt=require('bcrypt')
var CryptoJS = require("crypto-js");
const SimpleCrypto=require('simple-crypto-js').default
const _secretKey = process.env.SECRET_KEY; //key for create hash key 
const simpleCrypto = new SimpleCrypto(_secretKey);
const saltRounds=12
var createHashPwd = function (password) {
    return bcrypt.hashSync(password, saltRounds);
  };
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
    const topic=req.body.topic;
    const skill=req.body.skill;
    const user_id=req.body.id;
    const topic_id=db.collection('topic').findOne({nome:skill});
    if(!topic_id)
    res.sendStatus(500);
    const lista_user_id=db.collection('skill').aggregate([

        {
            $match:{topic:id_topic,skill:{$gte:skill}}
        },
        {
            $lookup: 
            {
                from: 'users',
                localField:'id_user',
                foreignField:'_id',
                pipeline:[
                    $project : {username:1,_id:0,nome:0,cognome:0,password:0}
                ],
                as: 'user'
            }
        },
        {
            $project:{id_user:1,skill:1,id_topic:0,_id:0}
        }
    ]).pretty();


});
app.listen(process.env.PORT||3000)