
console.log("lol bro");require('dotenv').config();

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
const mode="live";
const whitelist = mode === "test" ? ['http://127.0.0.1:5500']:['instalearn-364320.web.app', 'instalearn-364320.firebaseapp.com'];
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
app.use(cors());
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
    const username=sanitizer.escape(req.body.Username);
    const descrizione=sanitizer.escape(req.body.Descrizione);
    const email=sanitizer.escape(req.body.Email);
    const password=sanitizer.escape(req.body.Password);
    //const password=createHashPwd(req.body.password);
    if(!nome||!cognome||!username||!descrizione||!email||!password)
    return res.sendStatus(400);
    const risultato=(await db.collection("users").findOne({email:email}));
    const risultato2=(await db.collection("users").findOne({username:username}))
    if(risultato||risultato2){

        return res.sendStatus(400);
    }else{
        const criptata=encryptWithCryptoJS(password);
        const risp3=await db.collection('users').insertOne(
            {
                nome:nome,
                cognome:cognome,
                email:email,
                password: criptata,
                descrizione:descrizione,
                username:username
            }
        );
        const id=risp3.insertedId.valueOf();
        console.log(id);
        const materie=await db.collection('topic').find();
        var arr=await materie.toArray();
        for(var d  of arr)
        {
            await db.collection('skills').insertOne({rank:0,id_topic:d._id.valueOf(),id_user:id}); 
        }
        return res.sendStatus(200);
    }

});

app.post('/login',express.json(),async (req,res)=>{
    const email=sanitizer.escape(req.body.Email);
    const password=sanitizer.escape(req.body.Password);
    if(!email||!password)
    return res.sendStatus(400);
    const ris=await db.collection('users').findOne({email:email});
    if(ris)
    {
        console.log(ris.password);
        var decriptata=decryptionWithCryptoJS(ris.password);
        console.log(decriptata);
        if(decriptata==password)
        {
        return res.status(200).send({Id: ris._id.valueOf()});
        }
        else
        return res.sendStatus(400);
    }
    else
    {
        return res.sendStatus(400);
    }
});

app.post('/cercaInsegnante',express.json(),async (req,res)=>{
    const topic_id=sanitizer.escape(req.body.Id_topic);
    const skill=parseInt(sanitizer.escape(req.body.Skill));
    const user_id=sanitizer.escape(req.body.User_id);
    if(!topic_id||!skill||!user_id)
    return res.sendStatus(400);
    console.log(topic_id+" "+skill+" "+user_id);
    const ris=await db.collection('skills').find({id_topic:topic_id,id_user:{$ne:user_id},rank:{$gte:skill}});
    if(ris)
    {
        var arr=[];
        var risultati=await ris.toArray();
        for await (var doc of risultati)
        {
            
            const tot=await db.collection('users').findOne({_id:new ObjectId(doc.id_user)});
            console.log(doc);
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
    const idMateria=sanitizer.escape(req.body.Id_topic);
    const difficoltà=parseInt(sanitizer.escape(req.body.Skill));
    if(!idMateria||!difficoltà)
    return res.sendStatus(400);
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
            var opzioniDomanda=arrOpzioni.slice(0,1); //prende i primi 3 elementi dell'array
            await opzioniDomanda.push(await arropzioniGiuste[0]); //aggiungo l'opzione giusta
            opzioniDomanda=await shuffle(opzioniDomanda); //ordino random
            var opzioni_fatte=[];
            console.log(domanda);
            for await (var opzione of opzioniDomanda){
                    if(opzione){
                    opzioni_fatte.push({Id:opzione._id.valueOf(), Testo:opzione.testo});
                    /*await db.collection('test_domanda_opzione').insertOne({
                        id_opzione:opzione._id.valueOf(),
                        id_domanda:domanda._id.valueOf(),
                        id_test:id_test.valueOf()
                    });*/
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
    console.log(req.body);
    const id=sanitizer.escape(req.body.Id)
    const nome=sanitizer.escape(req.body.Nome);
    const cognome=sanitizer.escape(req.body.Cognome);
    const email=sanitizer.escape(req.body.Email);
    const password=sanitizer.escape(req.body.Password);
    var password_new=sanitizer.escape(req.body.NewPassword);
    if(!password_new)
    password_new=password;
    const descrizione=sanitizer.escape(req.body.Descrizione);
    const username=sanitizer.escape(req.body.Username);
    if(id&&nome&&cognome&&email&&password&&descrizione)
    {
        const ris=await db.collection('users').findOne({_id:new ObjectId(id)});
        if(ris)
        {
            var decriptata=decryptionWithCryptoJS(ris.password);
            if(decriptata==password)
            {
                var r=await db.collection('users').findOne({username:username});
                var r2=await db.collection('users').findOne({email:email});
                if((r&&(ris.username!=username))||(r2&&(ris.email!=email)))
                {
                    res.sendStatus(400);
                }
                else
                {
                    const criptata=encryptWithCryptoJS(password_new);
                    await db.collection('users').updateOne({_id: new ObjectId(id)},{$set:{nome:nome,cognome:cognome,email:email,password:criptata,descrizione:descrizione,username:username}});
                    res.sendStatus(200);
                }
            }
            else
            return res.sendStatus(400);
        }
        else
        {
            return res.sendStatus(400);
        }
    }
    else res.sendStatus(400);

});

//inviaRipostaTest(risposte, domande, id_test): calcola il punteggio, se punteggio è >=6 aggiorna skill
app.post('/inviaRispostaTest',express.json(),async (req,res)=>{
    var arr=JSON.parse(req.body.Risposte);
    const IdTest=sanitizer.escape(req.body.Id_test);
    const Id=sanitizer.escape(req.body.Id_utente);

    if(arr&&Id&&IdTest)
    {
        let p=0;
        for(var r of arr)
        {
            console.log(r);
            const risp=await db.collection('opzione').findOne({_id:new ObjectId(r.id_opzione)});
            if(risp)
            {
                console.log(risp);
                if(risp.giusta)
                    p++;
            }
        }
        let punteggio=p*10;
        const r3=await db.collection('test').findOne({_id: new ObjectId(IdTest)});
        if(!r3)
        return res.sendStatus(400);
        if(punteggio>60)
        {
            await db.collection("skills").updateOne({id_user:Id, rank:r3.rank},{$set:{rank:r3.rank}});
        }
        await db.collection('punteggio_test').insertOne({id_test:IdTest,id_utente:Id,punteggio:punteggio});
        return res.status(200).send({Id_test:IdTest,Id_utente:Id,Punteggio:parseInt(punteggio)});
    }
    else
    return res.sendStatus(400);
});

//getTestDisponibiliPerUtente
app.post('/getTestDisponibiliPerUtente',express.json(),async (req,res)=>{
    const id_utente=sanitizer.escape(req.body.Id);
    if(!id_utente)
    return res.sendStatus(400);
    const risp=await db.collection('users').findOne({_id:new ObjectId(id_utente)});
    if(risp)
    {
        const skills=await db.collection('skills').find({id_user:id_utente});
        const arr=await skills.toArray();
        return res.status(200).send({Tests:arr});
    }
    return res.sendStatus(400);
});

//getMateria(id_materia)
app.post('/getMateria',express.json(),async (req,res)=>{
    const idMateria=sanitizer.escape(req.body.IdMateria);
    if(!idMateria)
    return res.sendStatus(400);
    const materia=await db.collection('topic').findOne({_id:new ObjectId(idMateria)});
    if(materia){
        return res.status(200).send(materia);
    }else{
        return res.sendStatus(400);

    }
});
//getMaterie()
app.post('/getMaterie',express.json(),async (req,res)=>{
    var materie=await db.collection('topic').find();
    if(!materie)
    res.send(400);
    else{
    var att=[];
    for await(var d of materie)
    {
        att.push({Id:d._id.valueOf(),Nome:d.topic});
    }
    res.status(200).send({Materie:att});
    }
});

//getDatiUtente(username_utente)
app.post('/getDatiUtente',express.json(),async (req,res)=>{
    const username_utente=sanitizer.escape(req.body.Username);
    console.log(username_utente);
    if(!username_utente)
    return res.sendStatus(400);
    const risposta=await db.collection('users').findOne({username: username_utente});
    if(risposta)
    {
        console.log(risposta._id.valueOf());
        var skills=await db.collection('skills').find({id_user:risposta._id.valueOf()});
        skills=await skills.toArray();
        var att=[];
        for await(var doc of skills)
        {
            doc.materia=await db.collection('topic').findOne({_id:new ObjectId(doc.id_topic)});
            if(doc.materia)
            att.push({Id_topic:doc.id_topic,Materia:doc.materia.topic,Skill:doc.rank});
        }
        return res.status(200).send({Username:risposta.username, Nome:risposta.nome,Cognome:risposta.cognome,Descrizione:risposta.descrizione,Skills:att});
    }
    else
    return res.sendStatus(400);
});

//getDatiSeStesso(id_utente)
app.post('/getDatiSeStesso',express.json(),async (req,res)=>{
    const id_utente=sanitizer.escape(req.body.Id);
    if(!id_utente)
    return res.sendStatus(400);
    const dati_utente=await db.collection('users').findOne({_id:new ObjectId(id_utente)});
    
    if(dati_utente){
        var skill=await db.collection('skills').find({id_user:dati_utente._id.valueOf()});
        var arr=await skill.toArray();
        var att=[];
        for await(var tempSkill of arr){
            tempSkill.materia=await db.collection('topic').findOne({_id:new ObjectId(tempSkill.id_topic)});
            if(tempSkill.materia)
            att.push({Id_topic:tempSkill.id_topic,Materia:tempSkill.materia.topic,Skill:tempSkill.rank});
        }
        return res.status(200).send({Username:dati_utente.username, Email:dati_utente.email, Nome:dati_utente.nome, Cognome:dati_utente.cognome, Descrizione:dati_utente.descrizione,Skills:att});
    }else{
        return res.sendStatus(400);
    }
    
});

//getMessaggiAiuto(id_admin)
app.post('/getMessaggiAiuto',express.json(),async (req,res)=>{
    const id_admin=sanitizer.escape(req.body.Id_admin);
    if(!id_admin)
    return res.sendStatus(400);
    const risp=await db.collection('admins').findOne({_id:new ObjectId(id_admin)});
    if(risp)
    {
        const msgs=await db.collection('messaggi_aiuto').find();
        const arr=msgs.toArray();
        return res.status(200).send({messaggi:arr});
    }
    return res.sendStatus(400);
});
app.post('/inviaMessaggioAiuto',express.json(),async (req,res)=>{
    const nome=sanitizer.escape(req.body.Nome);
    const email=sanitizer.escape(req.body.Email);
    const soggetto=sanitizer.escape(req.body.Soggetto);
    const messaggio=sanitizer.escape(req.body.Messaggio);
    if(!nome||!email||!soggetto||!messaggio)
    return res.sendStatus(400);
    await db.collection('messaggi_aiuto').insertOne({nome:nome,email:email,soggetto:soggetto,messaggio:messaggio});
    return res.sendStatus(200);
});
//rispondiMessaggioAiuto(id_messaggio,id_admin,risposta)
app.post('/rispondiMessaggioAiuto',express.json(),async (req,res)=>{
    const id_admin=sanitizer.escape(req.body.Id_admin);
    const id_messaggio=sanitizer.escape(req.body.Id_messaggio);
    const risposta=sanitizer.escape(risposta);
    if(!id_admin||!id_messaggio||!risposta)
    return res.sendStatus(400);
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