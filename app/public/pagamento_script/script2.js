document.getElementById("pixForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evita o envio do formulário
  
    var chavePix = document.getElementById("chavePix").value;
    var valor = parseFloat(document.getElementById("valor").value);
  
    if (!chavePix || !valor || isNaN(valor) || valor <= 0) {
      document.getElementById("mensagem").innerText = "Por favor, preencha a chave PIX e o valor corretamente.";
      return;
    }
  
    // Aqui você iria integrar com uma API de pagamento PIX para gerar a cobrança
    // Neste exemplo simples, apenas exibimos uma mensagem de sucesso fictícia
    document.getElementById("mensagem").innerText = `Pagamento de R$ ${valor.toFixed(2)} para ${chavePix} efetuado com sucesso!`;
  });
  