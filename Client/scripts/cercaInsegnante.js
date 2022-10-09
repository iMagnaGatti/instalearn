async function test(){
    const ris=await post_data(api_url+"cercaInsegnante",
    {topic_id:'633e7ca713e3bf26d2365a33',skill:2,user_id:"cosaAcaso"}
    );
    var jsonData = await ris.json();
    var listatest="";
    for (var i=0;i<jsonData.length;i++) {
        console.log(jsonData[i]);
        var username = jsonData[i].username;
        var rank=jsonData[i].rank;
        listatest+="<h3>"+username+"</h3><br><h3>Level: "+rank+"</h3><br>";
    }
    document.getElementById("listatest").innerHTML=listatest;
}