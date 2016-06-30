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
        animateSlide("#status", "top", 48, 300, data);
      }
    })
  });

  $("input[type='checkbox']").on("click", function() {
    $("#delete-btn").attr("disabled", !$("input[type='checkbox']").is(":checked"));
  });

  $("#delete-btn").on("click", function() {
    let messageIds = [];
    let selectedMessages = $("input:checked").map(function() {
      messageIds.push($(this).data('message').id);
    })
    $.ajax({
      url: '/users/' + $(this).data('id') + '/messages',
      method: "DELETE",
      data: {messageIds: messageIds},
      success: (data) => {
        animateSlide("#status", "top", 48, 300, data);
      }
    })
  })

  $("#delete-btn")

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
