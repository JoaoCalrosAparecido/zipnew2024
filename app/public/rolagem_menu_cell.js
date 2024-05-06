window.addEventListener('scroll', function() {
    var openMenuBtn = document.getElementById('openMenuBtn');
    
    if (window.scrollY > 300) {
        openMenuBtn.style.backgroundImage = 'url("../IMG/area_do_menu/cell/menu_cell.png")';
    } else {
        openMenuBtn.style.backgroundImage = 'url("../IMG/area_do_menu/cell/menu_branco_cell.png")';
    }
});
