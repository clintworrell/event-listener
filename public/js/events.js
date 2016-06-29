$(function() {
  $(".add-event-btn").on("click", function() {
    let self = $(this);
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

  $(".event-row").on("mouseenter", function() {
    $(this).find('.add-event-btn').css("display", "inline");
  });
  $(".event-row").on("mouseleave", function() {
    $(this).find('.add-event-btn').css("display", "none");
  });
});
