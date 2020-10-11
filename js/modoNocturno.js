//Modo Nocturno

let checkbox = document.querySelector('input[name=theme]');
let menuBtn = document.getElementById('menu-btn');

checkbox.addEventListener('click', function() {
  
  if(this.checked) {
    transition();
    document.documentElement.setAttribute('data-theme', 'dark');
    changeImage();
    
  }else {
    transition();
    document.documentElement.setAttribute('data-theme', 'light');
    changeImage();
  }

  menuBtn.checked = false;
})

function changeImage() {
    let image = document.getElementById('logo');
    let camImage = document.getElementById('camImage');
    let tapeImage = document.getElementById('tapeImage');

    if (image.src.match("images/logoDarkMode.svg") || 
        camImage.src.match('images/camaraDarkMode.svg') ||
        tapeImage.src.match('images/peliculaDarkMode.svg')) {

        image.src = "images/logoLightMode.svg";
        camImage.src = 'images/camara.svg';
        tapeImage.src = 'images/pelicula.svg';

    } else {
        image.src = "images/logoDarkMode.svg";
        camImage.src = 'images/camaraDarkMode.svg';
        tapeImage.src = 'images/peliculaDarkMode.svg';
    }
}

let modeBtn = document.getElementById('mode');
let runSwitch = document.getElementById('switch');

modeBtn.addEventListener('click', () => {
    if(runSwitch.checked == true){
        modeBtn.innerHTML = 'Modo Nocturno';
    }else{
        modeBtn.innerHTML = 'Modo Diurno';
    }
});

let transition = () => {
  document.documentElement.classList.add('transition');
  window.setTimeout(() => {
    document.documentElement.classList.remove('transition');
  }, 1000);
}

