async function contatta()
{
    let nome=document.getElementById("nome").value;
    let email=document.getElementById("email").value;
    let soggetto=document.getElementById("soggetto").value;
    let messaggio=document.getElementById("messaggio").value;
    const risp=await post_data(api_url+"inviaMessaggioAiuto",{Nome:nome,Email:email,Soggetto:soggetto,Messaggio:messaggio});
    if(risp.status==200)
    {
        document.getElementById("risultato").style.backgroundColor="green";
        document.getElementById("risultato").innerHTML="Grazie, abbiamo ricevuto la tua richiesta";
    }
    else{
    document.getElementById("risultato").style.backgroundColor="red";
    document.getElementById("risultato").innerHTML="C'è stato un errore nella richiesta";
    }
}