const Universe = require('./universe');

document.addEventListener("DOMContentLoaded", function(event) {
  const menuElement = document.querySelector('.navigation');
  const menuHamburger = document.querySelector('.navigation-hamburger');
  const menuVertical = document.querySelector('.navigation-vertical');
  const menuItems = Array.from(document.querySelector('.navigation').children);
  let menuItemsX = [];
  let menuRecalculateBeyond = false;
  let sectionHeights = [];

  let videoPopped = false;
  const videoUrl = "https://www.youtube.com/embed/NPxLFo_7YEY";
  const galleryUrl = "http://lightwidget.com/widgets/6baef01c461059558f22e3309b2e3bb6.html";
  const instagramScript = "https://cdn.lightwidget.com/widgets/lightwidget.js";

  const popVideo = () => {
    if (videoPopped) return;
    document.getElementById('citywars-video').src = videoUrl;
    const insGal = document.getElementById('instagram-gallery');
    const insScript = document.getElementById('instagram-script');
    if (insGal !== null) insGal.src = galleryUrl;
    if (insScript !== null) insScript.src = instagramScript;
    videoPopped = true;
  }

  const menuUpdate = (force = false) => {
    const top = window.pageYOffset;
    const height = window.innerHeight;
    const width = window.innerWidth;

    const mobile = width <= 560;

    const basicTop = 80;
    const itemHeight = 80 + width / 100 * 3 + (mobile ? height / menuItems.length : 0);

    let progress = top < height ? top / height : 1;
    progress = Math.sin(progress * Math.PI / 2);

    if (top - sectionHeights[0] - sectionHeights[1] + height < 10 || 
        top - sectionHeights[0] - sectionHeights[1] - sectionHeights[2] > -10 ) {
      Universe.canvasCover = 0;
    } else {
      Universe.canvasCover = 1;
      popVideo();
    }

    if (!menuRecalculateBeyond || force === true || true) {
      menuItems.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const y = (height - basicTop - itemHeight * (-i + menuItems.length / 2)) / 2;
        const x = width - (menuElement.offsetLeft + item.offsetLeft) - 40 - rect.width;

        let blackness = top + rect.top - itemHeight / 4 + 20;
        let blacknessInverted = true;
        for (let i = 0; i < sectionHeights.length; i++) {
          if (blackness >= sectionHeights[i]) {
            blacknessInverted = !blacknessInverted;
            blackness -= sectionHeights[i];
            continue;
          }

          blackness /= sectionHeights[i];
          break;
        }
        
        if (blackness < 0.95) blackness = (blacknessInverted ? 0 : 1);
        else blackness = (blacknessInverted ? blackness - 0.95 : 1 - blackness) * 20;

        const b = (1 - blackness) * 255;

        item.style.transform = `translateX(${(x) * progress}px) translateY(${y * progress}px)`;
        item.style.color = `rgba(${b}, ${b}, ${b}, 255)`;
        item.style['border-color'] = `rgba(${b}, ${b}, ${b}, 255)`;

        menuItemsX[i] = x;
      });
    }

    if (progress === 1) menuRecalculateBeyond = true;
    else menuRecalculateBeyond = false;
  }

  const heightUpdate = () => {
    sectionHeights = [
      document.getElementById('landingpage').clientHeight,
      document.getElementById('webdesign').clientHeight,
      document.getElementById('games').clientHeight,
      document.getElementById('contact').clientHeight,
    ];
  }

  const menuClear = item => item.style.transform = ``;

  setTimeout(() => {
    heightUpdate();
    menuUpdate();
  }, 1);
  window.onscroll = menuUpdate;
  window.onresize = () => {
    heightUpdate();
    menuUpdate(true);
  };
  
  menuHamburger.onclick = e => {
    e.currentTarget.classList.toggle('active');
    menuVertical.classList.toggle('active');
  };

  for (let i = 0; i < menuVertical.children.length; i++) {
    menuVertical.children[i].onclick = e => {
      menuHamburger.classList.remove('active');
      menuVertical.classList.remove('active');
    };
  }
});
