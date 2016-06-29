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
            top: "-48px"
          }, 300, "linear")
        }, 2000);
        $(this).html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>");
        $(this).prop("disabled", true);
      }
    });
  });

  $(".share-event-btn").on("click", function(e) {
    let form = $("#receiver-form");
    form.css("display") === "none" ? form.css("display", "inline") : form.css("display", "none");
    form.css({
      top: e.pageY - 100,
      left: e.pageX + 25,
    });
    $("#subject").val("RE: " + $(this).data("event").name);
    $("#body").val("Get more info here:\n" + $(this).data("event").url);
    // $.ajax({
    //   url: '/events',
    //   method: 'POST',
    //   data: $(this).data("event"),
    // });
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
    $("#receiver-form").hide();
  })
});
