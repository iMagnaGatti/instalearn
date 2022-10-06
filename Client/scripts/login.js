
function login()
{
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    let xhr=new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/login");
    xhr.setRequestHeader("Accept","application/json");
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onload=()=>{
        if(xhr.status==200){
        console.log(JSON.parse(xhr.response).id);
        let id=JSON.parse(xhr.response).id;
        setCookie("instalearn_id",id,0.5);
        }
    };
    xhr.send(JSON.stringify(
        {
            email:email,
            password:pass
        }
    ));
}