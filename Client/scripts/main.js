const server="http://localhost:3000";
function signup()
{
    window.location.href="./signup.html";
}
function login()
{
    window.location.href="./login.html";
}
function insegnante()
{
    window.location.href="./insegnante.html";
}
function test()
{
    window.location.href="./test.html";
}
function user()
{
    window.location.href="./user.html";
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
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

function controlla(cname)
{
    if(getCookie(cname==""))
    document.getElementById('form').setAttribute("style","visibility:visible");
    else
    {

    }
    
}

function getUser()
{
    const lol=function(xhr)
    {
        if(xhr.status==200)
        alert("fatta");
        else
        alert("errore");
    }
    post(server+"/getUser",{id:getCookie("instalearn_id")},lol);
}
function post(link,data,fun)
{
    let xhr=XMLHttpRequest();
    xhr.setRequestHeader("Accept","application/json");
    xhr.setAttribute("Content-Type","application/json");
    xhr.open("POST",link);
    xhr.onload=fun;
    xhr.send(data);
    return xhr;
}
