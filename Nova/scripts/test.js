async function caricaTest()
{
    let id_utente=getCookie("instalearn_id");
    const risp= await post_data(api_url+"getTestDisponibiliPerUtente",{Id:id_utente});
    if(risp.status==200)
    {
        const ogg=await risp.json();
        const arr=ogg.Tests;
        for(const test of arr)
        {
            //inserire al documento html il test
        }
    }
}

async function eseguiTest(Id,Id_topic,Skill)
{
    let ogg={Id:Id,Id_Topic:Id_topic,Skill:Skill};
    const risp=await post_data(api_url+"generaTest",ogg);
    if(risp.status==200)
    {
        const g=await risp.json();
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