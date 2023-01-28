
console.log("lol bro");
require('dotenv').config();

const express= require('express');
const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('./swagger.json');
const app=express();
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
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
    const nome=sanitizer.escape(req.body.Nome);
    const cognome=sanitizer.escape(req.body.Cognome);
    const email=sanitizer.escape(req.body.Email);
    const password=sanitizer.escape(req.body.Password);
    //const password=createHashPwd(req.body.password);
    
    const risultato=(await db.collection("users").findOne({email:email}))
    if(risultato){

        return res.sendStatus(400);
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
    const email=sanitizer.escape(req.body.Email);
    const password=sanitizer.escape(req.body.Password);
    const ris=await db.collection('users').findOne({email:email});
    if(ris){
        console.log(ris.password);
        var decriptata=decryptionWithCryptoJS(ris.password);
        console.log(decriptata);
        if(decriptata==password){
        return res.status(200).send({Id: ris._id.valueOf()});
        }
        else
        return res.sendStatus(400);
    }
    else{
        return res.sendStatus(400);
    }
});

app.post('/cercaInsegnante',express.json(),async (req,res)=>{
    const topic_id=sanitizer.escape(req.body.Topic_id);
    const skill=sanitizer.escape(req.body.Skill);
    const user_id=sanitizer.escape(req.body.User_id);
    const ris=await db.collection('skills').find({topic_id:topic_id,user_id:{$ne:user_id},rank:{$gt:skill}});
    if(ris)
    {
        var arr=[];
        const risultati=await ris.toArray();
        for await (const doc of risultati)
        {
            
            const tot=await db.collection('users').findOne({_id:new ObjectId(doc.user_id)});
            
            if(tot)
            {
                await arr.push({Username:tot.username,Skill:doc.rank});
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
    while (currentIndex > 0) {
  
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
    //restituisce un array domande, ogni domanda ha 4 opzione , 3 sbagliate, 1 giusta
    //ogni opzione ha id_domanda, testo,id_opzione....
    const idMateria=sanitizer.escape(req.body.Topic_id);
    const difficoltà=parseInt(sanitizer.escape(req.body.Skill));
    const domande=await db.collection('domande').find({id_materia:idMateria,livelloDomanda:difficoltà});
    if(domande){
        //inserire un nuovo test e prendere l'_id
        const id_test=(await db.collection('test').insertOne({id_topic:idMateria,rank:difficoltà})).insertedId;
        
        var test=[];
        var arr=await domande.toArray();
        arr=shuffle(arr);
        arr=arr.slice(0,10);
        for await (var domanda of arr)
        {
            
            var opzioneGiusta=await db.collection('opzione').find({id_domanda:domanda._id.valueOf(), giusta:true});
            console.log(opzioneGiusta);
            var arropzioniGiuste=opzioneGiusta.toArray();
            arropzioniGiuste=await shuffle(arropzioniGiuste);
            var opzioniSbagliate=await db.collection('opzione').find({id_domanda:domanda._id.valueOf(), giusta:false});
            var arrOpzioni=await opzioniSbagliate.toArray();
            arrOpzioni=shuffle(arrOpzioni);
            console.log(domanda);
            var opzioniDomanda=arrOpzioni.slice(0,3); //prende i primi 3 elementi dell'array
            await opzioniDomanda.push(await arropzioniGiuste[0]); //aggiungo l'opzione giusta
            opzioniDomanda=await shuffle(opzioniDomanda); //ordino random
            var opzioni_fatte=[];
            console.log(domanda);
            for await (var opzione of opzioniDomanda){
                    if(opzione){
                    opzioni_fatte.push({Id:opzione._id.valueOf(), Testo:opzione.testo});
                    await db.collection('test_domanda_opzione').insertOne({
                        id_opzione:opzione._id.valueOf(),
                        id_domanda:domanda._id.valueOf(),
                        id_test:id_test.valueOf()
                    });
                }
            }
            test.push({Domanda:{"Id_domanda":domanda._id.valueOf(),"Testo":domanda.testo}, Opzioni:opzioni_fatte});
        };

        return res.status(200).send({Id_test:id_test,Domande:test});
    }else{
        res.sendStatus(400);
    }

});


//modificaDatiUtente(id_utente, datiUtente)
app.post('/modificaDatiUtente',express.json(),async (req,res)=>{
    
});

//inviaRipostaTest(risposte, domande, id_test): calcola il punteggio, se punteggio è >=6 aggiorna skill
app.post('/inviaRispostaTest',express.json(),async (req,res)=>{
    
});

app.post('/getTestDisponibiliPerUtente',express.json(),async (req,res)=>{
    const id_utente=sanitizer.escape(req.body.Id);
    const risp=await db.collection('users').findOne({_id:new ObjectId(id_utente)});
    if(risp)
    {
        const skills=await db.collection('skills').find({id_user:id_utente});
        const arr=await skills.toArray();
        var tests=[];
        for(const doc of arr)
        {
            var ris=await db.collection('test').findOne({id_topic: doc.id_topic,rank:doc.rank});
            ris=await ris.toArray();
            tests.push(ris);
        }
        return res.status(200).send({Tests:tests});
    }
    return res.sendStatus(400);
});

//getMateria(id_materia)
app.post('/getMateria',express.json(),async (req,res)=>{
    const idMateria=sanitizer.escape(req.body.IdMateria);
    const materia=await db.collection('topic').findOne({_id:new ObjectId(idMateria)});
    if(materia){
        return res.status(200).send({Materia: materia});
    }else{
        return res.sendStatus(400);
    }
});

//getDatiUtente(username_utente)
app.post('/getDatiUtente',express.json(),async (req,res)=>{
    const username_utente=sanitizer.escape(req.body.Username_utente);
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
    return res.status(400);
});

//getDatiSeStesso(id_utente)
app.post('/getDatiSeStesso',express.json(),async (req,res)=>{
    const id_utente=sanitizer.escape(req.body.Id_user);
    const dati_utente=await db.collection('users').findOne({_id:new ObjectId(id_utente)});
    
    if(dati_utente){
        const skill=await db.collection('skills').find({user_id:dati_utente._id.valueOf()});
        const arr=skills.toArray();
        for await(const tempSkill of arr){
            tempSkill.materia=await db.collection('topic').findOne({_id:new ObjectId(tempSkill.topic_id)});
        }
        return res.status(200).send({username:dati_utente.username, email:dati_utente.email, nome:dati_utente.nome, cognome:dati_utente.cognome, descrizione:dati_utente.descrizione,skills:arr});
    }else{
        return res.sendStatus(400);
    }
    
});

//getMessaggiAiuto(id_admin)
app.post('/getMessaggiAiuto',express.json(),async (req,res)=>{
    const id_admin=sanitizer.escape(req.body.Id_admin);
    const risp=await db.collection('admins').findOne({_id:new ObjectId(id_admin)});
    if(risp)
    {
        const msgs=await db.collection('messaggi_aiuto').find();
        const arr=msgs.toArray();
        return res.status(200).send({messaggi:arr});
    }
    return res.sendStatus(400);
});

//rispondiMessaggioAiuto(id_messaggio,id_admin,risposta)
app.post('/rispondiMessaggioAiuto',express.json(),async (req,res)=>{
    const id_admin=sanitizer.escape(req.body.Id_admin);
    const id_messaggio=sanitizer.escape(req.body.Id_messaggio);
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
        return res.sendStatus(400);

    }
    return res.sendStatus(400);
});

//endpoints per la chat




app.listen(port)