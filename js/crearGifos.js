//botones 1, 2, 3 -> para traerlos todos juntos.

let [filmStage1, filmStage2, filmStage3] = Array.from(document.querySelectorAll("span.number"));
let startBtn = document.getElementById('startBtn');
let titleCreateGif = document.getElementById('titleCreateGif');
let textCreateGif = document.getElementById('textCreateGif');
let counter = document.getElementById('counter');
const video = document.getElementById("gif-captor");

startBtn.addEventListener('click', recordProcess);
let contador = 0;

function recordProcess() {
    switch(contador){
        case 0:
            firstStage();
            break;
        case 1:
            secondStage();
            break;
        case 2:
            thirdStage();
            break;
        case 3:
            fourthtStage();
            break;
        case 4:
            fifthStage();
            break;
        default:
            break;
    }
}

console.log(video);

function firstStage() {
    filmStage1.classList.add('isCurrent');
    startBtn.classList.add('hiddenClass');
    titleCreateGif.innerHTML = '¿Nos das acceso <br> a tu cámara?';
    textCreateGif.innerHTML = 'El acceso a tu camara será válido sólo <br> por el tiempo en el que estés creando el GIFO.'


    navigator.getUserMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    
    navigator.getUserMedia ({
        // constraints
        video: true,
        audio: false
    },
    
    function(localMediaStream) {
        video.srcObject = localMediaStream;
        contador++;
        recordProcess();
    },
    
    // errorCallback
    function(err) { 
        alert('Dar permiso para grabar');
        console.log("Ocurrió el siguiente error: " + err);
        contador = 0;
    }
    
    );
}

function secondStage(){
    video.classList.remove("hiddenClass");
	startBtn.classList.remove("hiddenClass");
	startBtn.textContent = "grabar";
	titleCreateGif.classList.add("hiddenClass");
	textCreateGif.classList.add("hiddenClass");
	filmStage1.classList.remove("isCurrent");
	filmStage2.classList.add("isCurrent");
	contador++;
}

function thirdStage() {
    //iniciar gabración
    counter.classList.add("counter");
	counter.classList.remove("hiddenClass");
	counter.children[0].textContent	 = "00:00:00"
	startBtn.textContent = "finalizar";
	contador++;
}

function fourthtStage(){
    //Agregar evento para repetir captura y
	//Resetear todos los botones al estado correspondiente
	startBtn.textContent = "subir gifo";
	counter.children[0].textContent = "REPETIR CAPTURA";
	counter.children[0].classList.add("subrayadoHover");
	contador++;
}

function fifthStage() {
	counter.classList.add("hiddenClass");
	counter.classList.remove("counter");
	startBtn.classList.add("hiddenClass");
	filmStage2.classList.remove("isCurrent");
	filmStage3.classList.add("isCurrent");
}

//agregar evento para repetir captura 4
//resetear todos  los botons 5

// function getStreamAndRecord () { 
//     navigator.mediaDevices.getUserMedia({
//     audio: false,
//     video: {
//        height: { max: 480 }
//     }
//  })
//  .then(function(stream) {
//     video.srcObject = stream;
//     video.play()
//  }