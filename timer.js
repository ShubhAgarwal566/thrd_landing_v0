var end = new Date('12/01/2023 6:00 PM');

var now = new Date();
var distance = end - now;

if (distance < 0) {
  const timerContainer = document.getElementsByClassName("timerContainer")[0];
  timerContainer.style.display = "none";
}

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

var timerOver = false

function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {
      launch()
      document.getElementById('days').innerHTML = '0';
      document.getElementById('hours').innerHTML = '0';
      document.getElementById('minutes').innerHTML = '0';
      document.getElementById('seconds').innerHTML = '0';
      return;
    }

var days = Math.floor(distance / _day);
var hours = Math.floor((distance % _day) / _hour);
var minutes = Math.floor((distance % _hour) / _minute);
var seconds = Math.floor((distance % _minute) / _second);

document.getElementById('days').innerHTML = days
document.getElementById('hours').innerHTML = hours
document.getElementById('minutes').innerHTML = minutes
document.getElementById('seconds').innerHTML = seconds
}

window.onload = function () {
  timer = setInterval(showRemaining, 1000); 
}


