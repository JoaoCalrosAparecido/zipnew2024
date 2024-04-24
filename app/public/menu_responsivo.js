document.getElementById("openMenuBtn").addEventListener("click", function() {
    var menu = document.getElementById("menu");
    var overlay = document.getElementById("overlay");
    if (menu.style.right === "0%") {
      menu.style.right = "-50%";
      overlay.classList.remove('overlay-active');
    } else {
      menu.style.right = "0%";
      overlay.classList.add('overlay-active');
    }
  });
  
  document.getElementById("closeMenuBtn").addEventListener("click", function() {
    var menu = document.getElementById("menu");
    var overlay = document.getElementById("overlay");
    menu.style.right = "-50%";
    overlay.classList.remove('overlay-active');
  });
  