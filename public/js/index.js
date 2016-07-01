$(function() {
  $("#sign-up-btn").on("click", function() {
    $('#logbox').toggleClass('hidden');
    $('#firstname').focus();
  });

  $("#cancel-sign-up").on("click", function() {
    $('#logbox').toggleClass('hidden');
  });

  $("#login-btn").on("click", function() {
    $('#loginbox').toggleClass('hidden');
    $('#username').focus();
  });

  $("#cancel-login").on("click", function() {
    $('#loginbox').toggleClass('hidden');
  });
});
