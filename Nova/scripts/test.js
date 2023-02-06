async function caricaTest()
{
    let id_utente=getCookie("instalearn_id");
    const risp= await post_data(api_url+"getTestDisponibiliPerUtente",{Id:id_utente});
    if(risp.status==200)
    {
        const ogg=await risp.json();
        const arr=ogg.Tests;
        var s="";
        var materie="";
        for(const test of arr)
        {
            const nomeMateria= await post_data(api_url+"getMateria",{IdMateria:test.id_topic});
            var g=await nomeMateria.json();
            var nome=g.topic;
            console.log(nome);
            materie+='<option style="font-size: 20px;">'+nome+'</option>';
            //qua devi fare che per ogni test metti un bottone che se lo premi viene chiamata la funzione cookieTest( con parametri Id_utente:id_utente, Id_topic:test.id_topic e skill:test.rank)
            s+='<div class="col-lg-6" data-aos="fade-up" data-aos-delay="400"><div class="card-item"><div class="row"><div class="col-xl-5"><div class="card-bg" style="background-image: url(assets/img/funz.png);"></div></div><div class="col-xl-7 d-flex align-items-center"><div class="card-body"><h4 class="card-title">'+nome+' Modulo '+test.rank+' </h4><p>In questo modulo troverai 10 domande a risposta multipla. Per superare il test dovrai dare almeno 7 risposte corrette.</p></div><button onclick="cookiesTest(\''+test.id_topic+'\','+test.rank+')">ESEGUI IL TEST</button></div></div></div></div>';
        }
        document.getElementById("services-cards").innerHTML=s;
    }
    else
    window.location.replace("./error.html");

}
async function cookiesTest(Id_topic,Skill){
    setCookie("Id_topic",Id_topic,0.5);
    setCookie("Skill",Skill,0.5);
    window.location.replace("./test.html");
    //qua devi settare i cookies "Id, Id_topic e Skill e poi reindirizzare a test.html"
}
async function eseguiTest()
{
    
    const Id=getCookie("instalearn_id");
    const Id_topic=getCookie("Id_topic");
    const Skill=getCookie("Skill");
    
    let ogg={Id:Id,Id_topic:Id_topic,Skill:Skill};
    console.log(ogg);
    const risp=await post_data(api_url+"generaTest",ogg);
    if(risp.status==200)
    {

        const g=await risp.json();
        setCookie("Id_test",g.Id_test,0.5);
        var domande=g.Domande;
        var s="";
        var ndomanda=1;
        for(const domanda of domande){
            var opzioni=domanda.Opzioni;
            s+='<div class="testimonial-item" style="min-height:200px; padding-bottom:0px; margin-bottom: 0px; border-bottom: 0px;"><h5>Domanda '+ndomanda+'</h5><br>  <h3 style="font-size:20px">'+domanda.Domanda.Testo+'</h3><br><div style="font-size: 20px">';
            for(var  o of opzioni)
            s+='<input type="radio" id="domanda'+ndomanda+'" name="domanda'+ndomanda+'" value="'+o.Id+'"><label for="'+o.Id+'">'+o.Testo+'</label>'
            s+='</div> </div>';  
          ndomanda+=1;
        }
        s+='<button onclick="inviaTest()">CONCLUDI IL TEST</button>';
        document.getElementById("divDomande").innerHTML=s;
        //inserisci html le domande e le opzioni
    }
    else
    {
        window.location.replace("./error.html");
    }
}

async function inviaTest()
{
    console.log("ciao");
    var arr=[];
    //costruisco array delle risposte
    for(let i=1;i<=10;i++)
    {
        var ele=document.getElementsByName("domanda"+i);
        var ok=false;
        for(j=0;j<ele.length;j++){
            if(ele[j].checked){
            arr.push({id_opzione: ele[j].value});
            ok=true;
            }
        }
        if(!ok)
        {
            arr.push({id_opzione:ele[0].value});
        }
    }
    console.log(arr);
    const Id_test=getCookie("Id_test");
    const Id_utente=getCookie("instalearn_id");
    const risp=await post_data(api_url+"inviaRispostaTest",
    {
        Risposte:JSON.stringify(arr),
        Id_test:Id_test,
        Id_utente:Id_utente
    });
    if(risp.status==200)
    {
        const ogg=await risp.json();
        //visualizza punteggio
        alert("PUNTEGGIO: "+ogg.Punteggio+"% ");
    }
    else
    {
        window.location.replace("./error.html");
    }
}