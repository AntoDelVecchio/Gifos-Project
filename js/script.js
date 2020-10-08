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

//evento focusin se activa cuando el usuario selecciona la barra de búsqueda, la func "iconsSwitch intercambia la image lensIcon y crossIcons".
searchBarCtn.addEventListener('focusin', iconsSwitch);
searchBarCtn.addEventListener('focusout', beforeSwitch);

let searchSuggestionsCtn = document.getElementById('suggestionsCtn'); //se trae el contenedor donde van a mostrarse la palabras sugeridas
let NoSearchResultsCtn = document.getElementById('NoSearchResultsCtn');

//al levantar la tecla, la funcion autocompletar busca sugerencias
async function autoCompletar() {
    try {
        let searchWords = await fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${this.value}&api_key=${apiKey}`); //llamada al endpoint de autocompletar para traer las etiquetas

        let response = await searchWords.json(); //parseamos las respuestas obtenidas

        console.log(response);

        searchSuggestionsCtn.innerHTML = ''; //se vacía por completo el contenedor

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
                makeSearch(searchInput.value);
            });
        });

    } catch (error) {
        console.log(error);
    }
}

//funcion de busqueda

let gifCardTemplate = document.getElementById('gifCardTemplate').content.firstElementChild; //traer el template
let resultCtn = document.getElementById('resultCtn'); //traigo el div que contiener el template
let searchResultsSection = document.getElementById('searchResultsSection'); //traigo la seccion para sacarle el display none y que aparezca
let searchTitle = document.getElementById('searchTitle');
let moreBtn = document.getElementById('moreBtn');

//funcion que hace la busqueda
async function makeSearch(search) {
    let response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}&limit=${12}`);

    let responseParsed = await response.json();
    try {
        resultCtn.textContent = '';

        searchTitle.textContent = searchInput.value;

        searchResultsSection.classList.remove('hiddenClass');

        const gifs = responseParsed.data;

        if(gifs.length === 0){

            resultCtn.classList.add('hiddenClass');
            NoSearchResultsCtn.classList.remove('hiddenClass');
            moreBtn.classList.add('hiddenClass');
            return;
        }

        // moreBtn.addEventListener('mousedown', () => {
        //     makeSearch();
        // })

        responseParsed.data.forEach( gif => { //le paso el parametro gif a la arrow function
            addGIFsToDOM(gif, resultCtn)
        });

    } catch (error) {
        console.log(error);
    }
}

//funcion que rellena con los gif buscados
function addGIFsToDOM(gif, contenedor) {

    let gifCardTemplateClone = gifCardTemplate.cloneNode(true); //clonar template

    let trueGif = gifCardTemplateClone.children[1].children[0];
    trueGif.src = gif.images.fixed_height.url; //traer el gif desde la url height. gif es data[x]

    let gifAlt = gifCardTemplateClone.children[1].children[0];
    gifAlt.alt = gif.title; //traer el titulo del gif

    //datos del gif
    let gifTitle = gifCardTemplateClone.children[0].children[0];
    gifTitle.textContent = gif.title || 'Sin título';

    let gifUserName = gifCardTemplateClone.children[0].children[1];
    gifUserName.textContent = gif.username || 'Anónimo';

    //funcionalidades de botones
    //TO-DO --> eventListeners
    let gifFavIcon = gifCardTemplateClone.children[2].children[0];
    // gifFavIcon. = ;

    let gifDownloadIcon = gifCardTemplateClone.children[2].children[1];
    // gifDownloadIcon. = ;

    let gifExpandIcon = gifCardTemplateClone.children[2].children[2];
    // gifExpandIcon. = ;

    contenedor.appendChild(gifCardTemplateClone); //se apendea este contenedor al nodo clonado.
}

//al hacer click en el input para escribir los iconos intercambian su lugar.
function iconsSwitch() {
    crossIcon.style.display = 'flex';
    inputCtn.style.flexDirection = 'row-reverse';
    lensIcon.style.marginRight = '.2rem';
    lensIcon.style.color = 'var(--tertiary-color)';
}

//estado del input antes de que el usuario haga click.
function beforeSwitch() {
    crossIcon.style.display = 'none';
    inputCtn.style.flexFlow = 'row wrap';
    lensIcon.style.color = 'var(--primary-color)';
    searchSuggestionsCtn.innerHTML = '';
}

//click en el icono cruz vacía input

crossIcon.addEventListener('mousedown', function() {
    searchInput.value = '';
    searchSuggestionsCtn.innerHTML = '';
    resultCtn.innerHTML = ''; //preguntar sobre esto a Mati :)
    searchTitle.innerHTML = '';
    searchResultsSection.classList.add('hiddenClass');
    // NoSearchResultsCtn.classList.remove('NoSearchResultsCtn');
});

//click en el icono lupa hace la búsqueda
lensIcon.addEventListener('mousedown', () => {
    makeSearch(searchInput.value);
});

//tecla ENTER para hacer la busqueda

searchInput.addEventListener('keyup', (e) => {
    if( e.keyCode === 13){

        makeSearch(searchInput.value);

    } 
    // if (e.keyCode === 8){

    //     searchSuggestionsCtn.innerHTML = '';
    //     resultCtn.innerHTML = '';
    //     searchTitle.innerHTML = '';
    //     NoSearchResultsCtn.classList.remove('NoSearchResultsCtn');
    // }
});

//agrego a la sección de trendings las palabras más buscadas del momento.
let trendingWordsCtn = document.getElementById('trendingWordsCtn');

async function getTrendingsWords() {
    try {
        const trends = await fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`); //llamada al endpoint de términos de búsqueda de tendencia

        let text = await trends.json(); //parseamos la respuesta obtenida

        text.data.splice(5, 20); //sacamos las ultimas 15 palabras a data.

        // console.log(text);

        // trendingWords.textContent = text.data.join(', '); //imprimir el texto en html y separar las palabras.

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


//esconder secciones

//traigo las secciones principales para esconderlas o mostrarlas de acuerdo a lo que necesite
let introductionSection = document.getElementById('introduction');
let trendingSection = document.getElementById('trendGifos');

//seccion favoritos
//traigo el id del boton de favoritos en la barra de navegacion y el contenedor de la seccion favoritos. 
//Esto lo repito con la seccion mis gifos y tambien con la de crear gifos.

let favoritos = document.getElementById('favoritos');
let favoritosSection = document.getElementById('favsSection');

favoritos.addEventListener('click', () => {
    favoritosSection.classList.remove('hiddenClass');
    introductionSection.classList.add('hiddenClass');
    favoritos.classList.add('activeTab');

    if(!misGifosSection.classList.contains('hiddenClass')){

        misGifosSection.classList.add('hiddenClass');
        misGifos.classList.remove('activeTab');

    }else if(!creatGifSection.classList.contains('hiddenClass')) {

        creatGifSection.classList.add('hiddenClass');
        btnCrearGifo.classList.remove('activeBtn');
        trendingSection.classList.remove('hiddenClass');

    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        searchResultsSection.classList.add('hiddenClass');

    }
});

//seccion mis gifos
let misGifos = document.getElementById('misGifos');
let misGifosSection = document.getElementById('misGifosSection');

misGifos.addEventListener('click', () => {
    misGifosSection.classList.remove('hiddenClass');
    introductionSection.classList.add('hiddenClass');
    misGifos.classList.add('activeTab');

    if(!favoritosSection.classList.contains('hiddenClass')){

        favoritosSection.classList.add('hiddenClass');
        favoritos.classList.remove('activeTab');

    }else if(!creatGifSection.classList.contains('hiddenClass')) {

        creatGifSection.classList.add('hiddenClass');
        btnCrearGifo.classList.remove('activeBtn');
        trendingSection.classList.remove('hiddenClass');

    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        searchResultsSection.classList.add('hiddenClass');
        
    }
});

//seccion para crear gifos
let btnCrearGifo = document.getElementById('btnCrearGifo');
let creatGifSection = document.getElementById('creatGifSection');

btnCrearGifo.addEventListener('click', () => {
    creatGifSection.classList.remove('hiddenClass');
    btnCrearGifo.classList.add('activeBtn');
    introductionSection.classList.add('hiddenClass');
    trendingSection.classList.add('hiddenClass');

    if(!favoritosSection.classList.contains('hiddenClass')){

        favoritosSection.classList.add('hiddenClass');
        favoritos.classList.remove('activeTab');

    }else if(!misGifosSection.classList.contains('hiddenClass')){

        misGifosSection.classList.add('hiddenClass');
        misGifos.classList.remove('activeTab');
        
    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        searchResultsSection.classList.add('hiddenClass');
        
    }
});

//seccion home - logo
let home = document.getElementById('logo');

home.addEventListener('click', () => {
    introductionSection.classList.remove('hiddenClass');
    trendingSection.classList.remove('hiddenClass');

    if(!favoritosSection.classList.contains('hiddenClass')){

        favoritosSection.classList.add('hiddenClass');
        favoritos.classList.remove('activeTab');

    }else if(!misGifosSection.classList.contains('hiddenClass')){

        misGifosSection.classList.add('hiddenClass');
        misGifos.classList.remove('activeTab');

    }else if(!creatGifSection.classList.contains('hiddenClass')) {

        creatGifSection.classList.add('hiddenClass');
        btnCrearGifo.classList.remove('activeBtn');

    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        searchResultsSection.classList.add('hiddenClass');
        
    }
});



//scroll hacia abajo esconde nav bar - hacia arriba la muestra

let ubicacionPrincipal = window.pageYOffset;
//cuando en la ventana se haga un scroll llama una funcion

window.onscroll = function() {
    
    let desplazamientoActual = window.pageYOffset;

    if(ubicacionPrincipal >= desplazamientoActual) {

        document.getElementById('navBar').style.top = '0';

    }else{

        document.getElementById('navBar').style.top = '-100px';
    }
    ubicacionPrincipal = desplazamientoActual;
}