
console.log("lol bro");
require('dotenv').config();

const express= require('express');
const app=express();
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'instalearnreale@gmail.com',
      pass: 'vendraarmastima'
    }
  });

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
  };
const helmet = require('helmet');
const sanitizer = require('sanitizer');
const rateLimit = require("express-rate-limit");
const { send } = require('process');
const port = process.env.PORT || 3000;
var ObjectId=mongoose.Types.ObjectId;
const _secretKey = process.env.SECRET_KEY; //key for create hash key 
const urlencodedParser = bodyParser.urlencoded({ extended: true });
mongoose.connect(""+process.env.DATABASE_URL+"",{useNewUrlParser: true});
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

function encryptWithCryptoJS(plainText) {
    const key = CryptoJS.enc.Base64.parse(_secretKey);
    const iv1 = CryptoJS.enc.Base64.parse("hf8685nfhfhjs9h8");
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted + "";
}
function decryptionWithCryptoJS(cipher) {
    const key = CryptoJS.enc.Base64.parse(_secretKey);
    const iv1 = CryptoJS.enc.Base64.parse("hf8685nfhfhjs9h8");
    const plainText = CryptoJS.AES.decrypt(cipher, key, {
        keySize: 16,
        iv: iv1,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return plainText.toString(CryptoJS.enc.Utf8);
}

app.post('/signup',express.json(),async (req,res)=>{
    console.log(req.body);
    const nome=sanitizer.escape(req.body.nome);
    const cognome=sanitizer.escape(req.body.cognome);
    const email=sanitizer.escape(req.body.email);
    const password=sanitizer.escape(req.body.password);
    //const password=createHashPwd(req.body.password);
    
    const risultato=(await db.collection("users").findOne({email:email}))
    if(risultato){

        return res.sendStatus(505);
    }else{
        const criptata=encryptWithCryptoJS(password);
        await db.collection('users').insertOne(
            {
                nome:nome,
                cognome:cognome,
                email:email,
                password: criptata
            }
        );
        return res.sendStatus(200);
    }

});

app.post('/login',express.json(),async (req,res)=>{
    const email=sanitizer.escape(req.body.email);
    const password=sanitizer.escape(req.body.password);
    const ris=await db.collection('users').findOne({email:email});
    if(ris){
        console.log(ris.password);
        var decriptata=decryptionWithCryptoJS(ris.password);
        console.log(decriptata);
        if(decriptata==password){
        return res.status(200).send({id: ris._id.valueOf()});
        }
        else
        return res.sendStatus(500);
    }
    else{
        return res.sendStatus(500);
    }
});

app.post('/cercaInsegnante',express.json(),async (req,res)=>{
    const topic_id=sanitizer.escape(req.body.topic_id);
    const skill=sanitizer.escape(req.body.skill);
    const user_id=sanitizer.escape(req.body.user_id);
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
        return res.status(200).send(arr);
    }
    else
    return res.sendStatus(500);

});

//shuffle mischia un array
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

//generaTest(id_topic e difficoltà)
app.post('/generaTest',express.json(),async (req,res)=>{ //idmateria e difficoltà
    const idMateria=sanitizer.escape(req.body.id_materia);
    const difficoltà=sanitizer.escape(req.body.difficoltà);
    const domande=await db.collection('domande').find({id_materia:idMateria,livelloDomanda:difficoltà});
    if(domande){
        //inserire un nuovo test e prendere l'_id
        const id_test=(await db.collection('test').insertOne({id_topic:idMateria,rank:difficoltà})).insertedId;
        
        var test=[];
        const arr=domande.toArray();
        arr=shuffle(arr);
        for await (const domanda of arr)
        {
            
            var opzioneGiusta=await db.collection('opzione').find({id_domanda:domanda._id.valueOf(), giusta:true});
            var arropzioniGiuste=opzioneGiusta.toArray();
            arropzioniGiuste=shuffle(arropzioniGiuste);
            var opzioniSbagliate=await db.collection('opzione').find({id_domanda:domanda.valueOf(), giusta:false});
            var arrOpzioni=opzioniSbagliate.toArray();
            arrOpzioni=shuffle(arrOpzioni);
            var opzioniDomanda=arrOpzioni.slice(0,3); //prende i primi 3 elementi dell'array
            opzioniDomanda.push(arropzioniGiuste[0]); //aggiungo l'opzione giusta
            opzioniDomanda=shuffle(opzioniDomanda); //ordino random
            for await (const opzione of opzioniDomanda){
                await db.collection('test_domanda_opzione').insertOne({
                    id_opzione:opzione._id.valueOf(),
                    id_domanda:domanda._id.valueOf(),
                    id_test:id_test
                });
            }
            test.push({id_domanda:domanda._id.valueOf(), opzioni:opzioniDomanda});
        };

        return res.status(200).send({id_test:id_test,test:test});
    }else{
        res.sendStatus(500);
    }

});


//modificaDatiUtente(id_utente, datiUtente)
//getTestDisponibiliPerUtente(id_utente)
//inviaRipostaTest(risposte, domande, id_test)

app.post('/getTestDisponibiliPerUtente',express.json(),async (req,res)=>{
    const id_utente=sanitizer.escape(reeq.body.id_utente);
    const risp=await db.collection('users').findOne({_id:new ObjectId(id_utente)});
    if(risp)
    {
        const skills=await db.collection('skills').find({id_user:id_utente});
        const arr=skills.toArray();
        var tests=[];
        for(const doc of arr)
        {
            const risp=db.collection('test').findOne({id_topic: doc.id_topic,rank:doc.rank});
            tests.push(risp);
        }
        return res.status(200).send({tests:tests});
    }
    return res.sendStatus(500);
});

//getMateria(id_materia)
app.post('/getMateria',express.json(),async (req,res)=>{
    const idMateria=sanitizer.escape(req.body.id_materia);
    const materia=await db.collection('topic').findOne({_id:new ObjectId(idMateria)});
    if(materia){
        return res.status(200).send({materia: materia});
    }else{
        return res.sendStatus(500);
    }
});

//getDatiUtente(username_utente)
app.post('/getDatiUtente',express.json(),async (req,res)=>{
    const username_utente=sanitizer.escape(req.body.username_utente);
    const risposta=await db.collection('users').findOne({username: username_utente});
    if(risposta)
    {
        console.log(risposta._id.valueOf());
        const skills=await db.collection('skills').find({user_id:risposta._id.valueOf()});
        var arr=await skills.toArray();
        for await(var doc of arr)
        {
            doc.materia=await db.collection('topic').findOne({_id:new ObjectId(doc.topic_id)});
        }
        return res.status(200).send({username:risposta.username, nome:risposta.nome,cognome:risposta.cognome,descrizione:risposta.descrizione,skills:arr});
    }
    else
    return res.status(500);
});

//getDatiSeStesso(id_utente)
app.post('/getDatiSeStesso',express.json(),async (req,res)=>{
    const id_utente=sanitizer.escape(req.body.id_user);
    const dati_utente=await db.collection('users').findOne({_id:new ObjectId(id_utente)});
    
    if(dati_utente){
        const skill=await db.collection('skills').find({user_id:dati_utente._id.valueOf()});
        const arr=skills.toArray();
        for await(const tempSkill of arr){
            tempSkill.materia=await db.collection('topic').findOne({_id:new ObjectId(tempSkill.topic_id)});
        }
        return res.status(200).send({username:dati_utente.username, email:dati_utente.email, nome:dati_utente.nome, cognome:dati_utente.cognome, descrizione:dati_utente.descrizione,skills:arr});
    }else{
        return res.sendStatus(500);
    }
    
});

//getMessaggiAiuto(id_admin)
app.post('/getMessaggiAiuto',express.json(),async (req,res)=>{
    const id_admin=sanitizer.escape(req.body.id_admin);
    const risp=await db.collection('admins').findOne({_id:new ObjectId(id_admin)});
    if(risp)
    {
        const msgs=await db.collection('messaggi_aiuto').find();
        const arr=msgs.toArray();
        return res.status(200).send({messaggi:arr});
    }
    return res.sendStatus(500);
});

//rispondiMessaggioAiuto(id_messaggio,id_admin,risposta)
app.post('/rispondiMessaggioAiuto',express.json(),async (req,res)=>{
    const id_admin=sanitizer.escape(req.body.id_admin);
    const id_messaggio=sanitizer.escape(req.body.id_messaggio);
    const risposta=sanitizer.escape(risposta);
    const risp=await db.collection('admins').findOne({_id:new ObjectId(id_admin)});
    if(risp)
    {
        const messaggioAiuto= await db.collection('messaggio_aiuto').findOne({_id:new ObjectId(id_messaggio)});
        if(messaggioAiuto)
        {
            const email=messaggioAiuto.email;
            var mailOptions = {
                from: 'instalearnreale@gmail.com',
                to: messaggioAiuto.email,
                subject: 'Assistenza InstaLearn',
                text: risposta
              };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  return res.status(500);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            
            await db.collection('messaggio_aiuto').deleteOne({_id:new ObjectId(id_messaggio)});

            return res.sendStatus(200);
        }
        return res.sendStatus(500);

    }
    return res.sendStatus(500);
});

//endpoints per la chat




app.listen(port)