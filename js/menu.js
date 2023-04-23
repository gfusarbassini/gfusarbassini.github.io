function toggleMenu() {
    var menu = document.querySelector(".pg-menu-small");
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
    animMenu();
  }
  
    var menuToggle = document.getElementById("menu-toggle");
    var menuIcon = document.querySelector(".menu-icon");
    var menuLine1 = document.querySelector(".menu-line:nth-of-type(1)");
    var menuLine2 = document.querySelector(".menu-line:nth-of-type(2)");
    var menuLine3 = document.querySelector(".menu-line:nth-of-type(3)");
  
  
    menuIcon.addEventListener("click", function() {
      toggleMenu();
      menuToggle.checked = !menuToggle.checked;
      menuLine1.classList.toggle("menu-line-1");
      menuLine2.classList.toggle("menu-line-2");
      menuLine3.classList.toggle("menu-line-3");
    });
  
  
  var pgMenuSmall = document.getElementById("pg-menu-small");
  window.addEventListener("resize", function() {
    if (window.innerWidth > 900) {
      pgMenuSmall.style.display = "none";
      menuToggle.checked = !menuToggle.checked;
    }
  });