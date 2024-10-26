const cepInput = document.getElementById('cep');
    
cepInput.addEventListener('input', () => {
  const cep = cepInput.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

  if (cep.length === 8) { // Se o CEP tem 8 dígitos, faz a busca
    buscarEndereco(cep);
  }
});

async function buscarEndereco(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado!");
      return;
    }

    // Formata o endereço e exibe no input do CEP
    const enderecoCompleto = `${data.logradouro || ""}, ${data.bairro || ""}, ${data.localidade || ""} - ${data.uf || ""}`;
    cepInput.value = enderecoCompleto;

  } catch (error) {
    alert("Erro ao buscar o endereço!");
    console.error(error);
  }
}