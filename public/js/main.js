function animateSlide(element, origin, width, duration, data, persist) {
  if (data) {
    $(element).text(data);
  }
  let move = {};
  move[origin] = 0;
  $(element).animate(move, duration, "linear");
  move[origin] -= width;
  if (!persist) {
    setTimeout(function() {
      $(element).animate(move, duration, "linear");
    }, 2000);
  }
}
