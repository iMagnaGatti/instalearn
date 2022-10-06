function test(){
    let xhr=new XMLHttpRequest();
    xhr.open("POST","http://localhost:3000/test");
    xhr.setRequestHeader("Accept","application/json");
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onload=()=>{
        var jsonData = JSON.parse(myMessage);
        var listatest="";
        for (var i = 0; i < jsonData.listatopics.length; i++) {
            var topic = jsonData.listatopics[i].topic;
            var livello=jsonData.listaInsegnanti[i].skill;
            listatest+="<button>"+topic+"</button> Your Level: "+livello+"<br>";
        }
        document.getElementById("listatest").innerHTML(listatest);
    };
}