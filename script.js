const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const backdrop = document.getElementById("backdrop");

function openMenu() {
  menu.classList.add("active");
  backdrop.classList.add("active");
}

function closeMenu() {
  menu.classList.remove("active");
  backdrop.classList.remove("active");
}

hamburger.addEventListener("click", () => {
  if (menu.classList.contains("active")) {
    closeMenu();
  } else {
    openMenu();
  }
});

// click outside closes menu
backdrop.addEventListener("click", closeMenu);

// optional: close when clicking a link
document.querySelectorAll(".menu a").forEach(link => {
  link.addEventListener("click", closeMenu);
});