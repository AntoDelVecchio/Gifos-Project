

let [filmStage1, filmStage2, filmStage3] = Array.from(document.querySelectorAll('span.number')); //botones 1, 2, 3 -> para traerlos todos juntos.
let startBtn = document.getElementById('startBtn');
let titleCreateGif = document.getElementById('titleCreateGif');
let textCreateGif = document.getElementById('textCreateGif');
const video = document.getElementById("gif-captor");
let counter = document.getElementById('counter');
let reRecordBtn = counter.children[0];
let createOverlay = document.querySelector('#overlay');
let misGifosArray = JSON.parse(localStorage.getItem('misGifos'));

if(misGifosArray === null) {
    misGifosArray = [];
}


let recorder;
let gif;

//contador
let s = 0;
stoppedFlag = false;
let timerSet = 0;

function setTimer() {

    if (stoppedFlag == true) {
        clearInterval(timerSet)
        s = 0;
    }else {
        let timeValue = new Date(s * 1000).toISOString().substr(11, 8)
        reRecordBtn.textContent = timeValue;
        s++;
    }
    
};


startBtn.addEventListener('click', recordProcess);
let StageCounter = 0;

function recordProcess() {
    switch(StageCounter){
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
        StageCounter++;
        recordProcess();
    },
    
    // errorCallback
    function(err) { 
        alert('Dar permiso para grabar');
        console.log('Ocurrió el siguiente error: ' + err);
        StageCounter = 0;
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
	StageCounter++;
}

function thirdStage() {
    //iniciar gabración
    navigator.mediaDevices.getUserMedia({
		video: true
	}).then(async function(stream) {
		recorder = RecordRTC(stream, {
			type: 'gif',
			frameRate: 30,
			quality: 10,
			width: 360,
			hidden: 240,
			onGifRecordingStarted: function() {
			 console.log('started')
			}
		});
        recorder.startRecording();
        stoppedFlag = false;
        timerSet = setInterval(setTimer, 1000);
	});
    counter.children[0].classList.add('counter');
	counter.classList.remove('hiddenClass');
    // reRecordBtn.textContent	 = '00:00:00';
	startBtn.textContent = 'finalizar';
	StageCounter++;
}

function fourthtStage() {
    //Agregar evento para repetir captura y
    //Resetear todos los botones al estado correspondiente
    recorder.stopRecording(onStop);
	
	gif = recorder.getBlob();

	startBtn.textContent = 'subir gifo';
	reRecordBtn.textContent = 'repetir captura';
    reRecordBtn.classList.add('repeatHover');
    
    reRecordBtn.addEventListener('click', () => {
        StageCounter = 1;
        reRecordBtn.classList.remove('repeatHover');
        counter.classList.add('hiddenClass');
        reRecordBtn.textContent = '';
        recordProcess();
    })

	StageCounter++;
}

async function fifthStage() {

    createOverlay.classList.remove('hiddenClass');
    createOverlay.classList.add('loading');

    let form = new FormData();
    form.append('file', gif, 'newGif.gif');

    let response = await fetch(`https://upload.giphy.com/v1/gifs?=${form}&api_key=${apiKey}`, {
        method: 'POST',
        body: form,
        json: true
    });

    let data = await response.json();
    console.log(data.data);

    uploadComplete();

	misGifosArray.push(data.data.id);

    localStorage.setItem('misGifos', JSON.stringify(misGifosArray));
    console.log(localStorage);

	counter.classList.add('hiddenClass');
	counter.classList.remove('counter');
	startBtn.classList.add('hiddenClass');
	filmStage2.classList.remove('isCurrent');
	filmStage3.classList.add('isCurrent');
}

function onStop() {
    //generar archivo para subir
    stoppedFlag = true;
    console.log('yuuupi!!');
}

function uploadComplete() {
    let loaderImage = document.getElementById('loaderImage');
    let loaderText = document.getElementById('loaderText');

    if (loaderImage.src.match("images/loader.svg")) {

        loaderImage.src = "images/check.svg";
        loaderImage.style.animation= 'none';
        return;
    }

    loaderText.innerHTML = 'GIFO subido con éxito'; 
}


//seccion mis gifos
let gifosString = misGifosArray.toString();

let misGifosCtn = document.getElementById('misGifosCtn');
let emptyMessage = document.getElementById('emptyMessage');
let moreBtnSection = document.getElementById('moreBtnSection');

async function showGifos(gifosArray, container) {
    try {

        let gifosString = gifosArray.toString();

        if(gifosArray.length == 1){
            let response = await fetch(`https://api.giphy.com/v1/gifs/${gifosString}?&api_key=${apiKey}`);
            let responseParsed = await response.json();
            responseParsed.data.forEach((gif) => {
                addGIFsToDOM(gif, container)
            });
        }else if(gifosArray.length > 1){
            let response = await fetch(`https://api.giphy.com/v1/gifs?ids=${gifosString},?&api_key=${apiKey}`);
            let responseParsed = await response.json();
            responseParsed.data.forEach((gif) => {
                addGIFsToDOM(gif, container)
            });
            
            if(gifosArray.length <= 12){ 
                moreBtnSection.classList.add('hiddenClass');
            }else{
                moreBtnSection.classList.remove('hiddenClass');
            }
        }

        if(gifosArray.length === 0) {
            emptyMessage.classList.remove('hiddenClass');
            emptyMessage.classList.add('emptySection');
        }

    } catch (error) {
        console.log(error);
    }
}

// showGifos(misGifosArray, misGifosCtn);

//favorites

let favsCtn = document.getElementById('favsCtn');

console.log(favGifsArray);

function addToFavorites() {

    favGifsArray.push(this.id);
    localStorage.setItem('favGifs', JSON.stringify(favGifsArray));

}

// showGifos(favGifsArray, favsCtn);

function deleteMyGifo() {

}