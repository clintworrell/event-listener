$(function() {
  $("#inbox-btn").on("click", function() {
    select('#inbox');
    hide('#compose');
  });
  $("#compose-btn").on("click", function() {
    select('#compose');
    hide('#inbox');
  });

  function select(element) {
    $(element).show();
    $(`${element}-btn`).removeClass('btn-default');
    $(`${element}-btn`).addClass('btn-primary');
  }

  function hide(element) {
    $(element).hide();
    $(`${element}-btn`).removeClass('btn-primary');
    $(`${element}-btn`).addClass('btn-default');
  }
});
