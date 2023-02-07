
async function login()
{
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    const ris=await post_data("https://instalearn.herokuapp.com/login",
        {
            Email:email,
            Password:pass
        }
    );
    console.log(ris.status);
    if(ris.status==200){
    const ogg=await ris.json();
    console.log(ogg);
    let id=ogg.Id;
    await setCookie("instalearn_id",id,0.5);
    window.location.href = "index.html";
    }
    else
    alert("Le credenziali non corrispondono ad un account, riprova");

    
}
function controlla()
{

    var ris=getCookie("instalearn_id");
    console.log(ris);
    if(ris!="")
    {
        document.getElementById("form").style.visibility="hidden";
    }
    
}
