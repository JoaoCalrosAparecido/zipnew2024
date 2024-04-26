document.getElementById("send").addEventListener("click", function() {
    // Mostra "Denunciando" no botão
    document.getElementById("send").innerText = "Denunciando...";
  
    // Simula uma denúncia sendo feita (tempo de espera de 2 segundos)
    setTimeout(function() {
      // Após 2 segundos, mostra a mensagem de sucesso e altera o texto do botão
      document.getElementById("mensagem").innerText = "Sua denúncia foi realizada com sucesso.";
      document.getElementById("mensagem").style.display = "block";
      document.getElementById("send").innerText = "Denunciado";
    }, 2000);
  });
  