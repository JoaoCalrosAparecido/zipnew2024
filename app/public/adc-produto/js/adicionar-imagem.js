document.getElementById("fileInput").addEventListener("change", function(event) {
    var files = event.target.files;
    var preview = document.getElementById("preview");
    preview.innerHTML = "";
  
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileType = file.type.split("/")[0]; // Verifica se é uma imagem ou um vídeo
  
      if (fileType === "image") {
        var img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
      } else if (fileType === "video") {
        var video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.controls = true;
        preview.appendChild(video);
      }
    }
  
    // Adicionando a classe 'file-added' para ocultar a borda cinza
    document.getElementById("uploadLabel").classList.add("file-added");
  });
  
  // Adicionando um ouvinte de eventos para o clique no retângulo
  document.getElementById("uploadLabel").addEventListener("click", function() {
    document.getElementById("fileInput").click(); // Clique no campo de entrada de arquivo
  });
  