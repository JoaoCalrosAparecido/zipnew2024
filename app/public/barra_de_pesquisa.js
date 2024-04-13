const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');

searchIcon.addEventListener('click', function() {
  searchInput.classList.toggle('show');
});

searchInput.addEventListener('click', function(event) {
  event.stopPropagation(); // Impede que o clique dentro do input propague para o documento
});

document.addEventListener('click', function(event) {
  const isClickInsideSearchContainer = searchIcon.contains(event.target) || searchInput.contains(event.target);
  
  if (!isClickInsideSearchContainer) {
    searchInput.classList.remove('show');
  }
});
