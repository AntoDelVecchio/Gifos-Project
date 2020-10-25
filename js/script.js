//mi apikey
const apiKey = 'R4KtuKL0O6AKONW0nssK7Y06CXL1I4bc';

//searchBar

//llamo el id del contenedor de la search bar, al contenedor del input e images, y a las images.
let searchBarCtn = document.getElementById('searchBarCtn');
let inputCtn = document.getElementById('inputCtn');
let searchInput = document.getElementById('searchInput');
let crossIcon = document.getElementById('crossIcon');
let lensIcon = document.getElementById('lensIcon');

//evento keyup indica qué tecla se presionó y la func. "autocompletar busca las sugerencias de palabras".
searchInput.addEventListener('keyup', autoCompletar);

/*evento focusin cuando el usuario selecciona la barra de búsqueda está se habilita, 
la arrow function intercambia la image lensIcon y crossIcons".*/
searchBarCtn.addEventListener('focusin', () => {
    crossIcon.style.display = 'flex';
    inputCtn.style.flexDirection = 'row-reverse';
    lensIcon.style.marginRight = '.2rem';
    lensIcon.style.color = 'var(--tertiary-color)';
});

//barra de búsqueda sin habilitar
searchBarCtn.addEventListener('focusout', () => {
    crossIcon.style.display = 'none';
    inputCtn.style.flexFlow = 'row wrap';
    lensIcon.style.color = 'var(--primary-color)';
    searchSuggestionsCtn.innerHTML = '';
});

//click en el icono cruz vacía input y resultados buscados
crossIcon.addEventListener('mousedown', () => {
    searchInput.value = '';
    searchSuggestionsCtn.textContent = '';
    gifFoundContainer.textContent = ''; //preguntar sobre esto a Mati :)
    resultsSection.classList.add('hiddenClass');
});

//click en el icono lupa hace la búsqueda
lensIcon.addEventListener('mousedown', () => {
    cantidadClicks = 0;
    makeSearch(searchInput.value);
});

//tecla ENTER para hacer la busqueda
searchInput.addEventListener('keyup', (e) => {

    if( e.keyCode === 13){
        cantidadClicks = 0;
        makeSearch(searchInput.value);
        searchSuggestionsCtn.textContent = '';

    }else if (e.keyCode === 8){
        resultsSection.classList.add('hiddenClass');
        return;
    }
});

let favGifsArray = JSON.parse(localStorage.getItem('favGifs'));

    if(favGifsArray === null) {
        favGifsArray = [];
        localStorage.setItem('favGifs', JSON.stringify(favGifsArray));
    }


//contenedor donde van a mostrarse las palabras sugeridas
let searchSuggestionsCtn = document.getElementById('suggestionsCtn');


//al levantar la tecla, la funcion autocompletar busca sugerencias
async function autoCompletar() {
    try {
        let searchWords = await fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${this.value}&api_key=${apiKey}`); //llamada al endpoint de autocompletar para traer las etiquetas

        let response = await searchWords.json(); //parseamos las respuestas obtenidas

        console.log(response);

        searchSuggestionsCtn.textContent = ''; //se vacía por completo el contenedor

        //por cada sugerencia se crea un div contendor juntos con su id.
        response.data.forEach(element => {
            let suggestionBox = document.createElement('div');
            searchSuggestionsCtn.appendChild(suggestionBox);
            suggestionBox.id = 'suggestionBox'

            //se le apendea una imagen de lupa a cada div
            let suggestionImg = document.createElement('img');
            suggestionImg.setAttribute('src', 'images/lensSuggestions.svg');
            suggestionImg.style.width = '1.2rem';
            suggestionImg.alt = 'image'
            suggestionBox.appendChild(suggestionImg); //se apendea la imagen al div contenedor.

            //Buscar sugerencias
            let suggestion = element.name;
            //se crea un tag "p" para apendearle el texto de la sugerencia.
            let suggestedWord = document.createElement('p');
            suggestionBox.appendChild(suggestedWord);
            //se muestra en el html.
           suggestedWord.textContent = suggestion;

            suggestionBox.addEventListener('mousedown', () => {
                searchInput.value = suggestion; //autocompleta la barra con la palabra sugerida clickeada.
                cantidadClicks = 0;
                makeSearch(searchInput.value);
            });
        });

    } catch (error) {
        console.log(error);
    }
}

//función de búsqueda

////traer el template
let gifCardTemplate = document.getElementById('gifCardTemplate').content.firstElementChild; 
//div que contiener el template
let gifFoundContainer = document.getElementById('gifFoundContainer');
//seccion de resultados, creada con clase hidden en un principio, sólo aparece cuando se realiza una búsqueda.
let resultsSection = document.getElementById('searchResultsSection');
let searchTitle = document.getElementById('searchTitle');
//botón ver más
let moreBtn = document.getElementById('moreBtn');
let cantidadClicks = 0;

//hacer la búsqueda
async function makeSearch(search) {
    try {

        let offset =  12*cantidadClicks;

        let response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=${12}&offset=${offset}`);

        let responseParsed = await response.json();
        console.log(responseParsed);
        // console.log(responseParsed.data[0].id);

        if(cantidadClicks === 0) {
            gifFoundContainer.textContent = '';
        }

        searchTitle.textContent = searchInput.value;

        searchSuggestionsCtn.textContent = '';

        resultsSection.classList.remove('hiddenClass');

        //si la búsqueda no tiene resultados, mostrar en pantalla imagen y aviso
        if(responseParsed.data.length === 0){

            gifFoundContainer.classList.add('hiddenClass');
            resultsSection.children[1].classList.remove('hiddenClass');
            moreBtn.classList.add('hiddenClass');
            return;

        }else {
            resultsSection.children[1].classList.add('hiddenClass');
            moreBtn.classList.remove('hiddenClass');
        }
        
        responseParsed.data.forEach((gif) => {
            addGIFsToDOM(gif, gifFoundContainer)
        });

    } catch (error) {
        console.log(error);
    }
}

moreBtn.addEventListener('click', () => {
    cantidadClicks++;
    makeSearch(searchInput.value);
});

//funcion que rellena con los gif buscados
function addGIFsToDOM(gif, contenedor) {

    let gifCardTemplateClone = gifCardTemplate.cloneNode(true); //clonar template

    //traer el gif desde la url height. gif es data[x]
    let trueGif = gifCardTemplateClone.children[0];
    trueGif.src = gif.images.fixed_height.url; 

    //alt del gif
    let gifAlt = gifCardTemplateClone.children[0];
    gifAlt.alt = gif.title; 

    //datos del gif
    let gifTitle = gifCardTemplateClone.children[1].children[0].children[0];
    gifTitle.textContent = gif.title || 'Sin título';

    let gifUserName = gifCardTemplateClone.children[1].children[0].children[1];
    gifUserName.textContent = gif.username || 'Anónimo';

    // gifCardTemplateClone.children[0].id = gif.id; no usamos

    //funcionalidades botones
    // TO-DO --> eventListeners
    let gifFavIcon = gifCardTemplateClone.children[1].children[1].children[0].children[0];
    gifFavIcon.id = gif.id;
    console.log(gifFavIcon);

    if (contenedor.classList.contains('containerMisGifos')) {  //El primer botón permitirá eliminar un gif de "Mis gifos".
        gifFavIcon.classList.remove("fa-heart");
        gifFavIcon.classList.add("fa-trash-alt");
        // gifFavIcon.addEventListener("click", deleteMyGifo);

    } else { //El primer botón permitirá agregar/borrar favorito.
        const favorites = JSON.parse(localStorage.getItem("favGifs"));
        console.log(favorites);
        if (favorites.includes(gif.id)) {
            gifFavIcon.classList.remove("far");
            gifFavIcon.classList.add("fas");
        }
        gifFavIcon.addEventListener('click', addToFavorites);
    }

    let gifDownloadIcon = gifCardTemplateClone.children[1].children[1].children[1];
    // gifDownloadIcon. = ;
    let gifExpandIcon = gifCardTemplateClone.children[1].children[1].children[2];
    gifExpandIcon.addEventListener('click', () => {
        fullscreenView();
        gifExpandIcon.classList.add('hiddenClass');
    });
    gifCardTemplateClone.addEventListener('click', fullscreenView);

    contenedor.appendChild(gifCardTemplateClone); //se apendea este contenedor al nodo clonado.
}

let trendingWordsCtn = document.getElementById('trendingWordsCtn');
async function getTrendingsWords() {
    try {
        const trends = await fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`); //llamada al endpoint de términos de búsqueda de tendencia

        let text = await trends.json(); //parseamos la respuesta obtenida

        text.data.splice(5, 20); //sacamos las ultimas 15 palabras a data.

        text.data.forEach(trendingWord => {
            let span = document.createElement('span');

            if (trendingWord == text.data[text.data.length -1]){
                span.textContent = `${trendingWord}`;
            }else{
                span.textContent = `${trendingWord}, `;
            }

            trendingWordsCtn.appendChild(span);

            span.addEventListener('click', () => {
                searchInput.value = trendingWord;
                makeSearch(trendingWord);
            })
        });

    } catch (error) {
        console.log(error);
    }
}

getTrendingsWords();

//carousel

let carouselCtn = document.querySelector('.carousel');

async function showTrendingGifs() {
    try {
        let responseGif = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=10`);
        responseGif = await responseGif.json();
        // console.log(responseGif);

        responseGif.data.forEach(gif => {
            addGIFsToDOM(gif, carouselCtn)
        });

    } catch (error) {
        console.log(`Trending Gifs: \n${error}`);
    }
}

showTrendingGifs();

let carouselWrapper = document.querySelector('.carouselWrapper');
let carouselScroll = 0;

carouselWrapper.firstElementChild.addEventListener("mousedown", () => {
    carouselScroll = (carouselScroll < -180) ? carouselScroll + 180 : 0;
    carouselCtn.style.marginLeft = `${carouselScroll}px`;
});

carouselWrapper.lastElementChild.addEventListener("mousedown", () => {
    const width = carouselCtn.offsetWidth;
    const ctnWidth = carouselCtn.parentElement.offsetWidth;
    carouselScroll = (carouselScroll > -(width - ctnWidth - 180)) ? carouselScroll - 180 : -(width - ctnWidth);
    carouselCtn.style.marginLeft =`${carouselScroll}px`;
});

// fullscreen;

let gifContainer = document.getElementsByClassName('gifContainer');
let gifExpandBtn = document.getElementsByClassName('gifExpand');

function fullscreenView(e) {
    let gif = this;
    console.log(gif);
    if (!gif.classList.contains('fullscreenView')) {
        gif.classList.remove('gifContainer');
        gif.classList.add('fullscreenView');
        let iconClose = document.createElement('i');
        iconClose.classList.add('fas', 'fa-times', 'closeBtn');
        iconClose.addEventListener('click', (e) => {
            let gif = e.target.parentElement;
            gif.classList.remove('fullscreenView');
            gif.classList.add('gifContainer');
            iconClose.remove();
            e.stopPropagation();
        })
        gif.appendChild(iconClose);
        carouselCtn.style.marginLeft = '0';
    }
    carouselCtn.style.marginLeft = '1rem';
}

//download

async function downloadGif() {
    const a = document.createElement('a');
    const response = await fetch(this.parentElement.parentElement.parentElement.children[0].src);
    const file = await response.blob();
    a.download = `${this.dataset.title}.gif`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click()
}