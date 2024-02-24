const root = document.documentElement;
const marqueeElementsDisplayed = getComputedStyle(root).getPropertyValue("--marquee-elements-displayed");
const marqueeContent = document.querySelector("ul.marquee-content");

root.style.setProperty("--marquee-elements", marqueeContent.children.length);

for(let i=0; i<marqueeElementsDisplayed; i++) {
  marqueeContent.appendChild(marqueeContent.children[i].cloneNode(true));
}

const clientWidth = window.innerWidth;

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


var heroSwiper = new Swiper(".heroSwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  loop: true,  
  initialSlide: 1,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});

const captions = document.getElementsByClassName("carousel-caption")

function setActiveCaption(index) {
  captions[index].classList.add("active");
  captions[heroSwiper.previousIndex].classList.remove("active");
}

document.addEventListener("DOMContentLoaded", function () {
  setActiveCaption(heroSwiper.activeIndex);
});

heroSwiper.on("slideChange", () => {
  setActiveCaption(heroSwiper.activeIndex);
});

var swiper2 = new Swiper(".swiper2", {
  initialSlide: 0,
});
var swiper2part2 = new Swiper(".swiper2part2", {
  slidesPerView: 2,
  centeredSlides: true,
  slideToClickedSlide: true,
  // crossFade : true,
  // effect: "fade",
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

var reviewSwiper = new Swiper(".reviewSwiper", {
  slidesPerView: 2,
  centeredSlides: false,
  slideToClickedSlide: true,
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});
