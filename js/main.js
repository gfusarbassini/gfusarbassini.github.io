const menuLabels = document.querySelectorAll('.menu-label');

function showMaterial() {
  document.querySelectorAll('.material-symbols-outlined').forEach(function(icon) {
  icon.style.opacity = '1';
});}

let index = 0;

function animMenu() {
  index = 0; // Reset index to 0
  let intervalId = setInterval(() => {
    if (index >= menuLabels.length) {
      clearInterval(intervalId);
      return;
    }

    const menuLabel = menuLabels[index];
    menuLabel.classList.add('fill-menu-label');
    setTimeout(() => {
      menuLabel.classList.remove('fill-menu-label');
    }, 200);

    index++;
  }, 100);
}

animMenu();

$('.mail-link').on('click', function() {

  value = $(this).data('clipboard-text'); 

  var $temp = $("<input>");
  $("body").append($temp);

  $temp.val(value).select();

  document.execCommand("copy");
  $temp.remove();

  var $feedback = $('.copy-feedback');
  $feedback.fadeIn(200);
  

  setTimeout(function() {
    $feedback.fadeOut(200);
  }, 2000);
});

