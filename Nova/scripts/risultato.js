async function caricaRisultato()
{
    const queryString=window.location.search;
    const urlParams=new URLSearchParams(queryString);
    let ris="";
    if(urlParams.has("risultato")){
        ris=urlParams.get("risultato");
        let tot=parseInt(ris);
        if(tot>=60)
        document.getElementById("risultato").innerHTML="Congratulazioni! Hai passato il test.\nRisultato: "+tot+"%";
        else
            document.getElementById("risultato").innerHTML="Mi dispiace, non hai passato il test.\nRisultato: "+tot+"%";
    }
    else
    {
        window.location.replace("./error.html");
    }
}