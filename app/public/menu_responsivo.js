document.getElementById("openMenuBtn").addEventListener("click", function() {
  var menu = document.getElementById("menu");
  var overlay = document.getElementById("overlay");
  var openMenuBtn = document.getElementById("openMenuBtn");

  if (menu.style.right === "0%") {
      menu.style.right = "-66%";
      overlay.classList.remove('overlay-active');
      openMenuBtn.classList.remove('active');
  } else {
      menu.style.right = "0%";
      overlay.classList.add('overlay-active');
      openMenuBtn.classList.add('active');
  }
});

document.getElementById("closeMenuBtn").addEventListener("click", function() {
  var menu = document.getElementById("menu");
  var overlay = document.getElementById("overlay");
  var openMenuBtn = document.getElementById("openMenuBtn");

  menu.style.right = "-66%";
  overlay.classList.remove('overlay-active');
  openMenuBtn.classList.remove('active');
});
