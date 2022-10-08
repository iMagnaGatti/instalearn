
function signup()
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

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/signup");
    
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        
        xhr.onload = () =>
        {
            if(xhr.status==505){
                alert("la mail è già registrata");
            }else{
                alert("Iscritto correttamente");
            }
        }
        xhr.send(JSON.stringify({
            nome:nome,
            cognome:cognome,
            email:email,
            password:pass
        }));
        
    }
}