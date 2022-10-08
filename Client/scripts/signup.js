
function signup()
{
    let nome=document.getElementById('nome').value;
    let cognome=document.getElementById('cognome').value;
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    let pass2=document.getElementById('password2').value;
    
    let controllo=(pass.lenght>=8);
    let maiuscola=false,numero=false;
    for(var i=0;i<pass.lenght;i++){
        if(pass[i]>='A'&&pass[i]<='Z')maiuscola=true;
        if(pass[i]>='0'&&pass[i]<='9')numero=true;
    }
    if(!maiuscola)controllo=false;
    if(!numero)controllo=false;

    if(pass!=pass2)
    alert("Errore, le password devono corrispondere")
    else if(false){
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