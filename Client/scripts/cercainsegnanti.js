function cercainsegnanti(){
    let topic=document.getElementById('topic');
    let skill=document.getElementById('skill');

    let xhr=new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/cercaInsegnante");
    xhr.setRequestHeader("Accept","application/json");
    xhr.setRequestHeader("Content-Type","application/json");

    xhr.onload=()=>{
        var jsonData = JSON.parse(myMessage);
        var risultati="";
        for (var i = 0; i < jsonData.listaInsegnanti.length; i++) {
            var username = jsonData.listaInsegnanti[i].username;
            var livello=jsonData.listaInsegnanti[i].skill;
            risultati+="<div>"+username+"<br>"+topic+": "+livello+"<br></div>";
        }
        document.getElementById("risultati").innerHTML(risultati);
    };
    xhr.send(JSON.stringify(
        {
            id:getCookie("instalearn_id"),
            topic:topic,
            skill:skill
        }
    ));
}