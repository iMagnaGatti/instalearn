
async function signup()
{
    let nome=document.getElementById('nome').value.toString();
    let cognome=document.getElementById('cognome').value.toString();
    let email=document.getElementById('email').value.toString();
    var username=document.getElementById('username').value.toString();
    var descrizione=document.getElementById('descrizione').value.toString();
    var pass=document.getElementById('password').value.toString();
    var pass2=document.getElementById('password2').value.toString();
    if(nome.length==0)
    {
        alert("Inserisci il nome");
    }
    else if(cognome.length==0)
    {
        alert("Inserisci il cognome");
    }
    else if(email.length==0)
    {
        alert("Inserisci l'email");
    }
    else if(username.length==0)
    {
        alert("Inserisci l'username");
    }
    else if(descrizione.length==0)
    {
        alert("Inserisci la descrizione");
    }
    var controllo=(pass.length>=8);
    let maiuscola=false,numero=false;
    console.log(controllo);
    for(var i=0;i<pass.length;i++){
        if(pass[i]>='A'&&pass[i]<='Z')maiuscola=true;
        if(pass[i]>='0'&&pass[i]<='9')numero=true;
    }
    if(!maiuscola)controllo=false;
    console.log("Maiuscola:" + controllo);

    if(!numero)controllo=false;
    console.log("Numero:" + controllo);


    if(pass!=pass2)
    alert("Errore, le password devono corrispondere")
    else if(!controllo){
        alert("la password deve rispettare i seguenti requisiti:\n-Lunghezza di almeno 8 caratteri\n-Almeno una lettera maiuscola\n-Almeno un numero");
    }
    else{
        const ris=await post_data(api_url+"signup",{
            Nome:nome,
            Cognome:cognome,
            Email:email,
            Username:username,
            Descrizione: descrizione,
            Password:pass
        });
        if(ris.status==200)
        {
            window.location.replace("./index.html");
        }
        else if(ris.status==400)
        {
            alert("Email o username già registrato, riprova");
        }
        else
        {
            window.location.replace("./errore.html");
        }
    }
}