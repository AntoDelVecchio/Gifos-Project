//Modo Nocturno

let checkbox = document.querySelector('input[name=theme]');

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
})

function changeImage() {
    let image = document.getElementById('logo');
    if (image.src.match("images/logoDarkMode.svg")) {
        image.src = "images/logoLightMode.svg";
    } else {
        image.src = "images/logoDarkMode.svg";
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

