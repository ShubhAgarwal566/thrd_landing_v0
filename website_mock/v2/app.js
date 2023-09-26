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


var sneakImage = document.querySelector(".mySwiper .swiper-wrapper .swiper-slide-active img");
root.style.setProperty("--img-height", sneakImage.height + "px");