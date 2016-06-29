$(function() {
  $("#inbox-btn").on("click", function() {
    select('#inbox');
    hide('#compose');
  });
  $("#compose-btn").on("click", function() {
    select('#compose');
    hide('#inbox');
  });

  $("#compose-submit").on("click", function(e) {
    let message = {
      receiver: $("#receiver").val(),
      subject: $("#subject").val(),
      body: $("#body").val()
    }
    $.ajax({
      url: '/users/' + $(this).data('id') + '/messages',
      method: 'POST',
      data: message,
      success: (data) => {
        $("#status").text(data);
        $("#status").animate({
          top: 0
        }, 300, "linear")
        setTimeout(function() {
          $("#status").animate({
            top: "-48px"
          }, 300, "linear")
        }, 2000);
      }
    })
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
