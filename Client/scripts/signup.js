
async function signup()
{
    let nome=document.getElementById('nome').value;
    let cognome=document.getElementById('cognome').value;
    let email=document.getElementById('email').value;
    var pass=document.getElementById('password').value.toString();
    var pass2=document.getElementById('password2').value.toString();
    
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
            nome:nome,
            cognome:cognome,
            email:email,
            password:pass
        });
        if(ris.status==200)
        {
            alert("Registrazione andata a buon fine");
        }
        else if(ris.status==505)
        {
            alert("Email già registrata");
        }
        else
        {
            alert("Errore "+ris.status);
        }
    }
}