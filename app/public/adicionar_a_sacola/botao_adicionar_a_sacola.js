function handleClick() {
    var addButton = document.getElementById('produto_adicionar_a_sacola');

    addButton.textContent = 'ADICIONANDO...';
    addButton.disabled = true;

    setTimeout(function() {
        addButton.textContent = 'ADICIONADO';
        addButton.disabled = true;
        addButton.style.backgroundColor = '#28a745'; // Nova cor do botão
        addButton.style.color = '#fff'; // Nova cor do texto
    }, 2000); // Tempo simulado de carga: 2 segundos
}
