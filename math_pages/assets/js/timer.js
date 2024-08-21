function start_timer() {

  clearInterval(x);
  document.getElementById("time_remaining").innerHTML = "00:00";

  // Set initial amount
  var num_minutes = parseInt(document.getElementById("num_minutes").value);
  var num_seconds = parseInt(document.getElementById("num_seconds").value);

  // Set the date we're counting down to
  var countDownDate = new Date().getTime() + num_minutes * 60 * 1000 + num_seconds * 1000 + 1500;

  // Update the count down every 1 second
  var x = setInterval(function() {

    const button_start = document.querySelector('#start_timer');
    const button_stop = document.querySelector('#stop_timer');

    button_start.addEventListener('click', e => {
      clearInterval(x);
      document.getElementById("time_remaining").innerHTML = "00:00";
    });
    button_stop.addEventListener('click', e => {
      clearInterval(x);
      document.getElementById("time_remaining").innerHTML = "00:00";
    });

    // Get today's date and time
    var now = new Date().getTime();
    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // // Time calculations for days, hours, minutes and seconds
    // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //
    // // Output the result in an element with id="demo"
    // document.getElementById("demo").innerHTML = hours + "h "
    // + minutes + "m " + seconds + "s ";

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    if (minutes < 10) {
      var time_str = "0" + minutes + ":";
    }
    else {
      var time_str = minutes + ":";
    }
    if (seconds < 10) {
      time_str = time_str + "0" + seconds;
    }
    else {
      time_str = time_str + seconds;
    }

    document.getElementById("time_remaining").innerHTML = time_str;

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById("time_remaining").innerHTML = "EXPIRED";
    }
    if ((distance / 1000) <= 0 && (distance / 1000) > -1) {
      var audio = new Audio('./../../../audio/alarm.mp3');
      audio.play();
    }
  }, 1000);
}
