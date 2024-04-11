const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
let timeoutId;

searchIcon.addEventListener('mouseenter', function() {
  searchInput.classList.add('show');
});

searchInput.addEventListener('click', function(event) {
  event.stopPropagation(); // Impede que o clique dentro do input propague para o documento
});

document.addEventListener('click', function(event) {
  clearTimeout(timeoutId); // Limpa o timer ao clicar em qualquer parte do documento
  const isClickInsideSearchContainer = searchIcon.contains(event.target) || searchInput.contains(event.target);
  
  if (!isClickInsideSearchContainer) {
    searchInput.classList.remove('show');
  }
});

// Define um temporizador para esconder a barra de pesquisa após 2 segundos
searchInput.addEventListener('mouseleave', function() {
  timeoutId = setTimeout(function() {
    searchInput.classList.remove('show');
  }, 500);
});
