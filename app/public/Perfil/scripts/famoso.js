var famoso = document.getElementById("famous");

famoso.addEventListener("click", function(){
    var container = document.getElementById("motag");
    if(container.style.display === "block"){
        container.style.display = "none";
    } else {
        container.style.display = "block";
    }
})
