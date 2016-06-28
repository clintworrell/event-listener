$(function() {
  $(".add-event-btn").on("click", function() {
    let self = $(this);
    $.ajax({
      url: '/events',
      method: 'POST',
      data: $(this).data("event"),
      success: (addedEvent) => {
        $(this).html("<span class='glyphicon glyphicon-ok' aria-hidden='true'></span>");
        $(this).prop("disabled", true);
      }
    });
  });
});
