'use strict';
const slide = document.querySelector('.slide');
const slideVW = document.querySelector('.slide .viewport').offsetWidth;
const slideItemWrap = document.querySelector('.slide .item-wrap');
const slideControl = document.querySelectorAll('.slide .btn-wrap');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const progressBar = document.querySelector('.progress .bar');
const progressValue = document.querySelector('.progress .value');

var
  itemCount = imageData.length, // biến imageData được lấy từ file image_data.js
  itemIndex = 0,
  autoSlide = null,
  slideInterval = 3000;

function prevSlide() {
  itemIndex--;
  if (itemIndex < 0)
    itemIndex = itemCount - 1;
  slideItemWrap.style.marginLeft = `${-itemIndex * slideVW}px`;
}

function nextSlide() {
  itemIndex++;
  if (itemIndex > itemCount - 1)
    itemIndex = 0;
  slideItemWrap.style.marginLeft = `${-itemIndex * slideVW}px`;
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

slide.onmouseenter = () => {
  slideControl.forEach((el) => {
    el.classList.add('show');
  });
};
slide.onmouseleave = () => {
  slideControl.forEach((el) => {
    el.classList.remove('show');
  });
  if (!autoSlide)
    autoSlide = setInterval(nextSlide, slideInterval);
};

/**
 *
 * @param {Array} urls là mảng chứa các url hình ảnh sẽ được append vào slide
 */

function appendItem(urls) {
  let loaded = 0;
  const pendingItem = [];
  return new Promise((resolve) => {
    urls.forEach((url) => {
      let item = document.createElement('div');
      let img = document.createElement('img');
      item.classList.add('item');
      img.onload = () => {
        loaded++;
        let percent = Math.floor(loaded / itemCount * 100);
        progressValue.innerHTML =
        progressBar.style.width = `${percent}%`;
        if (loaded === itemCount) {
          pendingItem.forEach((item) => {
            slideItemWrap.appendChild(item);
          });
          resolve();
        };
      };
      img.src = `./img/${url}`;
      item.appendChild(img);
      pendingItem.push(item);
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