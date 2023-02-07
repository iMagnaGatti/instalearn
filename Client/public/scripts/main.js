const mode = "live"; //"test"
const api_url = "https://instalearn.herokuapp.com/";
var id=null;
var username="";
async function post_data(url, data) {
    return await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
}

async function get_data(url) {
    return await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
function getCookie(cname)
{
    let name=cname+"=";
    let decodedCookie=decodeURIComponent(document.cookie);
    let ca=decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
}
function setCookie(cname,  cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function removeCookie(cname)
{
    if( getCookie( cname ) ) {
        document.cookie = cname + "=" +
          ";path=/"+
          ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
      }
}
function logout(){
    removeCookie("instalearn_id");
    id = null;
    window.location.replace("./index.html");
}
function load()
{
    const id=getCookie("instalearn_id");
    if(id!="")
    {
        document.getElementById("list").innerHTML+='<li><a href="trovaInsegnante.html">Trova un insegnante</a></li>'+
        '<li><a href="cercaTest.html">Testa le tue conoscenze</a></li>'+
        '<li><a href="profilo.html">Profilo&nbsp;&nbsp;&nbsp;&nbsp;</a></li>';
        document.getElementById("list").innerHTML+='<li><input type="text" placeholder="Username" id="username"><button onclick="cercaUtente()">Cerca</button></li>';
        document.getElementById("list").innerHTML+='<li ><a href="" onclick="logout()">Log Out</a></li>';
    }
    else
    {
        document.getElementById("list").innerHTML+='<li><a href="login.html">Log In</a></li>';
        document.getElementById("list").innerHTML+='<li><a href="signup.html">Sign Up</a></li>';
    }
}
function cercaUtente()
{
    let username=document.getElementById("username").value;
    window.location.replace("./profiloUtente.html?username="+username);
}