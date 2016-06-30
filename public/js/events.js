$(function() {
  $(".add-event-btn").on("click", function() {
    $.ajax({
      url: '/events',
      method: 'POST',
      data: $(this).data("event"),
      success: (data) => {
        animateSlide("#status", "top", 48, 300, data);
        $(this).html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>");
        $(this).prop("disabled", true);
      }
    });
  });

  $(".delete-event-btn").on("click", function() {
    $.ajax({
      url: '/users/' + $(this).data('id') + '/events/' + $(this).data('event').id,
      method: 'DELETE',
      data: $(this).data('event'),
      success: (data) => {
        $(this).closest('.event-row').remove();
        animateSlide("#status", "top", 48, 300, data);
      }
    });
  });

  $(".share-event-btn").on("click", function() {
    $("#subject").val("RE: " + $(this).data("event").name);
    $("#body").val("Get more info here:\n" + $(this).data("event").url);
    animateSlide("#receiver-form", "left", 400, 300, null, true);
  });

  $("#compose-submit").on("click", function(e) {
    let message = {
      receiver: $("#receiver").val(),
      subject: $("#subject").val(),
      body: $("#body").val()
    }
    if ($("#receiver").val() === "" || $("#body").val() === "") {
      animateSlide("#status", "top", 48, 300, "Please complete the form.");
    }
    else {
      $.ajax({
        url: '/users/' + $(this).data('id') + '/messages',
        method: 'POST',
        data: message,
        success: (data) => {
          animateSlide("#status", "top", 48, 300, data);
          if (data === "Message sent.") {
            $("#receiver-form").animate({
              left: -400
            }, 300, "linear");
          }
        }
      });
    }
  });

  $(".event-row").on("mouseenter", function() {
    $(this).find('.add-event-btn').css("display", "inline");
    $(this).find('.share-event-btn').css("display", "inline");
    $(this).find('.delete-event-btn').css("display", "inline");
  });

  $(".event-row").on("mouseleave", function() {
    $(this).find('.add-event-btn').css("display", "none");
    $(this).find('.share-event-btn').css("display", "none");
    $(this).find('.delete-event-btn').css("display", "none");
  });

  $("#compose-cancel").on("click", function() {
    $("#receiver-form").animate({
      left: -400
    }, 300, "linear");
  })
});
