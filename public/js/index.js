$(function() {
  $("#sign-up-btn").on("click", function() {
    $('#logbox').toggleClass('hidden');
  });

  $("#cancel-sign-up").on("click", function() {
    $('#logbox').toggleClass('hidden');
  });

  $("#login-btn").on("click", function() {
    $('#loginbox').toggleClass('hidden');
  });

  $("#cancel-login").on("click", function() {
    $('#loginbox').toggleClass('hidden');
  });
});
