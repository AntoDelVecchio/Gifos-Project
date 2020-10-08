//botones 1, 2, 3 -> para traerlos todos juntos.

let [filmStage1, filmStage2, filmStage3] = Array.from(document.querySelectorAll('span.number'));
let startBtn = document.getElementById('startBtn');
let titleCreateGif = document.getElementById('titleCreateGif');
let textCreateGif = document.getElementById('textCreateGif');
const video = document.getElementById("gif-captor");
let counter = document.getElementById('counter');
let reRecordBtn = counter.children[0];
let misGifosArray = JSON.parse(localStorage.getItem('misGifos'));

if(misGifosArray === null) {
    misGifosArray = [];
}

let recorder;
let gif;


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
        video: true,
        audio: false
    },

    // successCallback
    function(localMediaStream) {
        video.srcObject = localMediaStream;
        contador++;
        recordProcess();
    },
    
    // errorCallback
    function(err) { 
        alert('Dar permiso para grabar');
        console.log('Ocurrió el siguiente error: ' + err);
        contador = 0;
    }
    
    );
}

function secondStage(){
    video.classList.add('video');
	startBtn.classList.remove('hiddenClass');
	startBtn.textContent = 'grabar';
	titleCreateGif.classList.add('hiddenClass');
	textCreateGif.classList.add('hiddenClass');
	filmStage1.classList.remove('isCurrent');
	filmStage2.classList.add('isCurrent');
	contador++;
}

function thirdStage() {
    //iniciar gabración
    navigator.mediaDevices.getUserMedia({
		video: true
	}).then(async function(stream) {
		recorder = RecordRTC(stream, {
			type: 'gif',
			frameRate: 1,
			quality: 10,
			width: 360,
			hidden: 240,
			onGifRecordingStarted: function() {
			 console.log('started')
			}
		});
		recorder.startRecording();
	});
    counter.classList.add('counter');
	counter.classList.remove('hiddenClass');
	reRecordBtn.textContent	 = '00:00:00'
	startBtn.textContent = 'finalizar';
	contador++;
}

function fourthtStage(){
    //Agregar evento para repetir captura y
    //Resetear todos los botones al estado correspondiente
    recorder.stopRecording(onStop);
	
	gif = recorder.getBlob();

	startBtn.textContent = 'subir gifo';
	reRecordBtn.textContent = 'repetir captura';
    reRecordBtn.classList.add('repetirCapturaHover');
    
    reRecordBtn.addEventListener('click', () => {
        contador = 1;
        reRecordBtn.classList.remove('repetirCapturaHover');
        counter.classList.add('hiddenClass');
        reRecordBtn.textContent = '';
        recordProcess();
    });

	contador++;
}

async function fifthStage() {

    let form = new FormData();
    form.append('file', gif, 'newGif.gif');

    let response = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
        method: 'POST',
        body: form,
        json: true
    });

    let data = await response.json();
    console.log(data.data);

	// misGifosArray.push(data.data.id);

	// localStorage.setItem('misGifos', JSON.stringify(misGifosArray));

	counter.classList.add('hiddenClass');
	counter.classList.remove('counter');
	startBtn.classList.add('hiddenClass');
	filmStage2.classList.remove('isCurrent');
	filmStage3.classList.add('isCurrent');
}

function onStop() {
    //generar archivo para subir
    console.log('yuuupi!!');
}