$(function() {
  getGeo();

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


function getGeo() {
  if (!navigator.geolocation){
    return;
  }

  promisifyWebGeoLocation()
  .then( (position) => {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    $.ajax({
      url: '/',
      method: 'POST',
      data: {latitude: latitude, longitude: longitude},
      success: function(data) {
        let suggestedEvents = $("<div>");
        suggestedEvents.html(data);
        suggestedEvents.prepend("<h1><strong>Events Near You</strong></h1>");
        suggestedEvents.addClass('suggested-events');
        $('.events-table').append(suggestedEvents);
      }
    });
  })
  .catch( () => {
    console.log('Following the instruction, we are not tracking your location.')
  })
}


function promisifyWebGeoLocation() {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(success, error);
        function success(position) {
          resolve(position);
        };
        function error() {
          reject();
        };
    });
}
