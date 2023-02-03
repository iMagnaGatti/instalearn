
async function login()
{
    let email=document.getElementById('email').value;
    let pass=document.getElementById('password').value;
    const ris=await post_data(api_url+"login",
        {
            Email:email,
            Password:pass
        }
    );
    if(ris.status==200){
    const ogg=await ris.json();
    console.log(ogg);
    let id=ogg.Id;
    setCookie("instalearn_id",id,0.5);
    window.location.href = "index.html";
    }
    else
    alert("Error "+ris.status);
    
}
function controlla()
{

    var ris=getCookie("instalearn_id");
    console.log(ris);
    if(ris=="")
    {
        document.getElementById("form").setAttribute("style","visibility:visible");
    }
}
