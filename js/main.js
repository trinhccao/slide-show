'use strict';
const slide = document.querySelector('.slide');
const slideViewport = document.querySelector('.slide .viewport');
const slideVW = slideViewport.offsetWidth;
const slideControl = document.querySelectorAll('.slide .btn-wrap');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const progressBar = document.querySelector('.progress .bar');
const progressValue = document.querySelector('.progress .value');

var
  slideItems = [],
  itemCount = imageData.length, // biến imageData được lấy từ file image_data.js
  itemIndex = 0,
  autoSlide = null,
  slideInterval = 3000;

function prevSlide() {
  itemIndex--;
  if (itemIndex < 0) {
    slideItems[0].addEventListener('animationend', function () {
      this.classList.remove('active', 'right');
    });
    slideItems[0].classList.add('right');
    slideItems[itemCount - 1].addEventListener('animationend', function () {
      this.classList.add('active');
      this.classList.remove('prev', 'right');
    });
    slideItems[itemCount - 1].classList.add('prev', 'right');
  } else {
    slideItems[itemIndex + 1].addEventListener('animationend', function () {
      this.classList.remove('active', 'right');
    });
    slideItems[itemIndex + 1].classList.add('right');
    slideItems[itemIndex].classList.add('prev', 'right');
    slideItems[itemIndex].addEventListener('animationend', function () {
      this.classList.add('active');
      this.classList.remove('prev', 'right');
    });
  }
  if (itemIndex < 0)
    itemIndex = itemCount - 1;
}

function nextSlide() {
  itemIndex++;
  if (itemIndex > itemCount - 1)
    itemIndex = 0;
  if (itemIndex === 0) {
    slideItems[itemCount - 1].addEventListener('animationend', function () {
      this.classList.remove('active', 'left');
    });
    slideItems[itemCount - 1].classList.add('left');
  } else {
    slideItems[itemIndex - 1].addEventListener('animationend', function () {
      this.classList.remove('active', 'left');
    });
    slideItems[itemIndex - 1].classList.add('left');
  }
  slideItems[itemIndex].classList.add('next', 'left');
  slideItems[itemIndex].addEventListener('animationend', function() {
    this.classList.add('active');
    this.classList.remove('next', 'left');
  });
}

btnPrev.onclick = () => {
  clearInterval(autoSlide); // dừng việc tự động chuyển slide
  autoSlide = null;
  prevSlide();
};
btnNext.onclick = () => {
  clearInterval(autoSlide); // dừng việc tự động chuyển slide
  autoSlide = null;
  nextSlide();
};

slide.onmouseleave = () => {
  if (!autoSlide)
    autoSlide = setInterval(nextSlide, slideInterval);
};

/**
 *
 * @param {Array} urls là mảng chứa các url hình ảnh sẽ được append vào slide
 */

function appendItem(urls) {
  let loaded = 0;
  return new Promise((resolve) => {
    urls.forEach((url) => {
      let item = document.createElement('div');
      let img = document.createElement('img');
      item.classList.add('item');
      item.appendChild(img);
      slideItems.push(item);
      img.onload = () => {
        loaded++;
        let percent = Math.floor(loaded / itemCount * 100);
        progressValue.innerHTML =
        progressBar.style.width = `${percent}%`;
        if (loaded === itemCount) {
          slideItems.forEach((item) => {
            slideViewport.appendChild(item);
          });
          slideItems[0].classList.add('active');
          resolve();
        };
      };
      img.src = `./img/${url}`;
    });
  });
}

window.onload = () => {
  appendItem(imageData).then(() => { // biến imageData được lấy từ file image_data.js
    document.querySelector('.modal').style.display = 'none';
    slide.classList.remove('hidden');
    autoSlide = setInterval(nextSlide, slideInterval);
  });
}