async function caricaTest()
{
    let id_utente=getCookie("instalearn_id");
    const risp= await post_data(api_url+"getTestDisponibiliPerUtente",{Id:id_utente});
    if(risp.status==200)
    {
        const ogg=await risp.json();
        const arr=ogg.Tests;
        var s="";
        for(const test of arr)
        {
            s+='<div class="col-lg-6" data-aos="fade-up" data-aos-delay="400"><div class="card-item"><div class="row"><div class="col-xl-5"><div class="card-bg" style="background-image: url(assets/img/funz.png);"></div></div><div class="col-xl-7 d-flex align-items-center"><div class="card-body"><h4 class="card-title">Analisi 1 -Modulo 4 "Studio di funzione"</h4><p>In questo modulo troverai 10 domande a risposta multipla sullo studio di funzione. Per superare il test dovrai dare almeno 7 risposte corrette.</p></div></div></div></div></div>'
        }
        document.getElementById("services-cards").innerHTML=s;
    }
}

async function eseguiTest(Id,Id_topic,Skill)
{
    let ogg={Id:Id,Id_Topic:Id_topic,Skill:Skill};
    const risp=await post_data(api_url+"generaTest",ogg);
    if(risp.status==200)
    {
        const g=await risp.json();
        var domande= g.domande;
        var s="";
        var ndomanda=1;
        for(const domanda of domande){
          s+='<div class="testimonial-item" style="min-height:200px; padding-bottom:0px; margin-bottom: 0px; border-bottom: 0px;"><h5>Domanda '+ndomanda+'</h5><br>  <h3 style="font-size:20px">2+2 fa 4?</h3><br><div style="font-size: 20px"> <input type="radio" id="domanda'+ndomanda+'" name="domanda'+ndomanda+'" value="YES"><label for="YES">SI</label><input type="radio" id="domanda'+ndomanda+'" name="domanda'+ndomanda+'" value="NO"><label for="NO">NO</label></div> </div>'  
          ndomanda+=1;
        }
        s+='<input type="submit" value="CONCLUDI IL TEST">';
        document.getElementById("FormDomande").innerHTML=s;
        //inserisci html le domande e le opzioni
    }
    else
    {
        //inserisci html messaggio di errore
    }
}

async function inviaTest(Id_test)
{
    var arr=[];
    //costruisco array delle risposte
    var id_utente=getCookie("instalearn_id");
    
    const risp=await post_data(api_url+"inviaRispostaTest",
    {
        Risposte:arr,
        Id_test:Id_test,
        Id_utente:id_utente
    });
    if(risp.status==200)
    {
        const ogg=risp.json();
        var punteggio=ogg.punteggio;
        //visualizza punteggio
    }
    else
    {
        //vai a pagina di errore
    }
}