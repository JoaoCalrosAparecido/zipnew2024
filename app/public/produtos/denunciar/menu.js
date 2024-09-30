const ally = document.getElementById("ally");

// Abrir o menu de denúncia de produto
document.getElementById("openMenuBtn").addEventListener("click", function () {
    var menu = document.getElementById("menu");
    var overlay = document.getElementById("overlay");

    // Exibir o menu deslizando da direita e o overlay
    menu.style.right = "0";
    overlay.style.display = "block";
    ally.classList.add("background");
});

// Fechar o menu de denúncia de produto
document.getElementById("closeMenuBtn").addEventListener("click", function () {
    var menu = document.getElementById("menu");
    var overlay = document.getElementById("overlay");

    // Ocultar o menu deslizando para a direita e o overlay
    menu.style.right = "-50%";
    overlay.style.display = "none";
    ally.classList.remove("background");
});

// Abrir o menu de denúncia de vendedor
document.getElementById("openMenuBt").addEventListener("click", function () {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");

    // Exibir o menu deslizando da direita e o overlay
    menu.style.right = "0";
    overlay.style.display = "block";
    ally.classList.add("background");
});

// Fechar o menu de denúncia de vendedor
document.getElementById("closeMenuB").addEventListener("click", function () {
    var menu = document.getElementById("men");
    var overlay = document.getElementById("overlay");

    // Ocultar o menu deslizando para a direita e o overlay
    menu.style.right = "-50%";
    overlay.style.display = "none";
    ally.classList.remove("background");
});

// Fechar ambos os menus clicando no overlay
document.getElementById("overlay").addEventListener("click", function () {
    var menu1 = document.getElementById("menu");
    var menu2 = document.getElementById("men");
    var overlay = document.getElementById("overlay");

    // Ocultar ambos os menus e o overlay
    menu1.style.right = "-50%";
    menu2.style.right = "-50%";
    overlay.style.display = "none";
    ally.classList.remove("background");
});
