
function signup()
{
    let nome=document.getElementById('nome').value;
    let cognome=document.getElementById('cognome').value;
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    let pass2=document.getElementById('password2').value;
    if(pass!=pass2)
    alert("Errore, le password devono corrispondere")
    else{

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/signup");
    
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
    
        xhr.onload = () =>
        {
                alert("Iscritto correttamente");
        }
        xhr.send(JSON.stringify({
            nome:nome,
            cognome:cognome,
            email:email,
            password:pass
        }));
    }
}
