$(function() {
  $(".add-event-btn").on("click", function() {
    $.ajax({
      url: '/events',
      method: 'POST',
      data: $(this).data("event"),
      success: (data) => {
        $("#status").text(data);
        $("#status").animate({
          top: 0
        }, 300, "linear")
        setTimeout(function() {
          $("#status").animate({
            top: -48
          }, 300, "linear")
        }, 2000);
        $(this).html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>");
        $(this).prop("disabled", true);
      }
    });
  });

  $(".share-event-btn").on("click", function(e) {
    let form = $("#receiver-form");
    $("#subject").val("RE: " + $(this).data("event").name);
    $("#body").val("Get more info here:\n" + $(this).data("event").url);
    form.animate({
      left: 10
    }, 300, "linear");
  });

  $("#compose-submit").on("click", function(e) {
    let message = {
      receiver: $("#receiver").val(),
      subject: $("#subject").val(),
      body: $("#body").val()
    }
    if ($("#receiver").val() === "" || $("#body").val() === "") {
      $("#status").text("Please complete the form.");
      $("#status").animate({
        top: 0
      }, 300, "linear")
      setTimeout(function() {
        $("#status").animate({
          top: -48
        }, 300, "linear")
      }, 2000);
    } else {
      $("#receiver-form").animate({
        left: -400
      }, 300, "linear");
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
              top: -48
            }, 300, "linear")
          }, 2000);
        }
      });
    }
  });

  $(".event-row").on("mouseenter", function() {
    $(this).find('.add-event-btn').css("display", "inline");
    $(this).find('.share-event-btn').css("display", "inline");
  });

  $(".event-row").on("mouseleave", function() {
    $(this).find('.add-event-btn').css("display", "none");
    $(this).find('.share-event-btn').css("display", "none");
  });

  $("#compose-cancel").on("click", function() {
    $("#receiver-form").animate({
      left: -400
    }, 300, "linear");
  })
});
