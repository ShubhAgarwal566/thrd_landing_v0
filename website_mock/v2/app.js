const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for(let i=0; i<marqueeElementsDisplayed; i++) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}

const clientWidth = window.innerWidth;

if(clientWidth > 1000) {  
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 6,
    spaceBetween: 30,
    centeredSlides: true,
    initialSlide: 3,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}else{
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 30,
    loop: true,    
    centeredSlides: true,
    initialSlide: 3,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

var swiper = new Swiper(".heroSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,  
  initialSlide: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

var swiper2 = new Swiper(".swiper2", {

});
var swiper2part2 = new Swiper(".swiper2part2", {
  slidesPerView: 2,
  centeredSlides: true,
  slideToClickedSlide: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
swiper2.on('slideChange', function () {
  swiper2part2.slideTo(swiper2.activeIndex)
});
swiper2part2.on('slideChange', function () {
  swiper2.slideTo(swiper2part2.activeIndex)
});



var sneakImage = document.querySelector(".mySwiper .swiper-wrapper .swiper-slide-active img");
root.style.setProperty("--img-height", sneakImage.height + "px");

var end = new Date('10/12/2023 10:1 AM');

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;
function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {

        clearInterval(timer);
        // document.getElementById('countdown').innerHTML = 'EXPIRED!';

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