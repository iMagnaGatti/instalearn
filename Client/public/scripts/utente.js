async function modificaDati()
{
    if(getCookie("instalearn_id")=="")
    window.location.replace("./error.html");
    let nome=document.getElementById('nome').value;
    let cognome=document.getElementById('cognome').value;
    let email=document.getElementById('email').value;
    let id=getCookie("instalearn_id");
    let username=document.getElementById('username').value;
    let pass=document.getElementById('password').value;
    let new_pass=document.getElementById('newpass').value;
    let new_pass2=document.getElementById('newpass2').value;
    var controllo=(new_pass.length>=8);
    let maiuscola=false,numero=false;
    console.log(controllo);
    for(var i=0;i<new_pass.length;i++){
        if(new_pass[i]>='A'&&new_pass[i]<='Z')maiuscola=true;
        if(new_pass[i]>='0'&&new_pass[i]<='9')numero=true;
    }
    if(!maiuscola)controllo=false;
    console.log("Maiuscola:" + controllo);

    if(!numero)controllo=false;
    console.log("Numero:" + controllo);


    if(new_pass!=new_pass2)
    alert("Errore, le password devono corrispondere");
    else if(!controllo){
        alert("la password deve rispettare i seguenti requisiti:\n-Lunghezza di almeno 8 caratteri\n-Almeno una lettera maiuscola\n-Almeno un numero");
    }
    else
    {
        let descrizione=document.getElementById('descrizione').value;
        const risp=await post_data(api_url+"inviaRispostaTest", 
        {
            Id:id,
            Nome:nome,
            Cognome:cognome,
            Email:email,
            Password:pass,
            NewPassword:new_pass,
            Descrizione:descrizione,
            Username:username
        });
        if(risp.status==200)
        {
            //visualizzare nell'html il risultato
        }
        else
        {
            //errore, scrivere il motivo
        }
    }   

}
async function getProfilo()
{
    if(getCookie("instalearn_id")=="")
    window.location.replace("./error.html");
    var id=getCookie("instalearn_id");
    console.log(id);
    const risp=await post_data(api_url+"getDatiSeStesso",{Id:id});
    if(risp.status==200)
    {
        
        const ogg=await risp.json();
        document.getElementById("nome").innerHTML=ogg.Nome+" "+ogg.Cognome;
        document.getElementById("email").innerHTML=ogg.Email;
        document.getElementById("username").innerHTML=ogg.Username;
        document.getElementById("descrizione").innerHTML=ogg.Descrizione;
        const arr=ogg.Skills;
        document.getElementById("materie").innerHTML="";

        for(const d of arr)
        {
            document.getElementById("materie").innerHTML+="<div style='text-align: center;'><button style='width: 200px;'>"+d.Materia+" "+d.Skill+"</button></div>";
        }
    }
    else{
        window.location.replace("./error.html");
    }
}
async function getProfiloUtente()
{
    if(getCookie("instalearn_id")=="")
    window.location.replace("./error.html");
    const queryString=window.location.search;
    const urlParams=new URLSearchParams(queryString);
    if(!urlParams.has("username"))
        window.location.replace("./error.html");
    else
    {
        const risp=await post_data(api_url+"getDatiUtente",{Username:urlParams.get("username")});
        if(risp.status===200)
        {
            console.log("no");
            const ogg=await risp.json();
            document.getElementById("nome").innerHTML=ogg.Nome+" "+ogg.Cognome;
            document.getElementById("username").innerHTML=ogg.Username;
            document.getElementById("descrizione").innerHTML=ogg.Descrizione;
            const arr=ogg.Skills;
            document.getElementById("materie").innerHTML="";
            for(const d of arr)
            {
                document.getElementById("materie").innerHTML+="<div style='text-align: center;'><button style='width: 200px;'>"+d.Materia+" "+d.Skill+"</button></div>";
            }
            document.getElementById("team").style.visibility="visible";
            return;
        }
        console.log("si");
        document.getElementById("team").style.visibility="visible";
        document.getElementById("team").innerHTML="<h5 style='text-align:center'>Mi dispiace, non esiste un utente con questo username</h5>";
    }
}