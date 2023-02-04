async function caricaMaterie()
{
    const risp=await post_data(api_url+"getMaterie");
    if(risp.status==200)
    {
        const ogg=await risp.json();
        const arr=ogg.Materie;
        document.getElementById("materie").innerHTML="";
        for(const d of arr)
        {
            document.getElementById("materie").innerHTML+="<option style='font-size: 20px;' value='"+d.Id+"'>"+d.Nome+"</option>";
        }
    }
    else{
        window.location.replace("./error.html");
    }
}
async function trovaInsegnante(){
    const lol={Id_topic:document.getElementById('materie').value,Skill:parseInt(document.getElementById('livello').value),User_id:getCookie("instalearn_id")};
    const ris=await post_data(api_url+"cercaInsegnante",lol);
    if(ris.status==200){
        var jsonData = await ris.json();
        console.log(jsonData);
        var listaInsegnanti="";
        for (var i=0;i<jsonData.length;i++) {
            console.log(jsonData[i]);
            var username = jsonData[i].Username;
            var rank=jsonData[i].Skill;
            listaInsegnanti+= "<div class='testimonial-item' style='min-height:200px; padding-bottom:0px; margin-bottom: 0px; border-bottom: 0px;'>"+
                    "<img src='assets/img/testimonials/testimonials-1.jpg' class='testimonial-img' alt=''''>"
                    +"<h3>"+username+"</h3>"
                    +"<h4> Livello: "+rank+"</h4>"
                +"<div class='stars'>";

            for(let i=0;i<rank;i++){listaInsegnanti+="<i class='bi bi-star-fill'></i>";}
            listaInsegnanti+="</div>"+"</div>";
        }
        document.getElementById("listaInsegnanti").innerHTML=listaInsegnanti;
    }
    else
    {
        window.location.replace("./error.html");
    }
}