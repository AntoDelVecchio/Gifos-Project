//esconder secciones

//traigo las secciones principales para esconderlas o mostrarlas de acuerdo a lo que necesite
let introductionSection = document.getElementById('introduction');
let trendingSection = document.getElementById('trendGifos');

//seccion favoritos
//traigo el id del boton de favoritos en la barra de navegacion y el contenedor de la seccion favoritos. 
//Esto lo repito con la seccion mis gifos y tambien con la de crear gifos.
//esto es muy repetitivo --->>>> mejorar think Anto!

let favoritosBtn = document.getElementById('favoritosBtn');
let favoritosSection = document.getElementById('favsSection');

favoritosBtn.addEventListener('click', () => {
    favoritosSection.classList.remove('hiddenClass');
    introductionSection.classList.add('hiddenClass');
    favoritosBtn.classList.add('activeTab');
    favsCtn.innerHTML= '';
    showGifos(favGifsArray, favsCtn);

    if(!misGifosSection.classList.contains('hiddenClass')){

        misGifosSection.classList.add('hiddenClass');
        misGifosBtn.classList.remove('activeTab');

    }else if(!createGifSection.classList.contains('hiddenClass')) {

        createGifSection.classList.add('hiddenClass');
        btnCrearGifo.classList.remove('activeBtn');
        trendingSection.classList.remove('hiddenClass');

    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        resultsSection.classList.add('hiddenClass');

    }
    menuBtn.checked = false;
});

//seccion mis gifos
let misGifosBtn = document.getElementById('misGifosBtn');
let misGifosSection = document.getElementById('misGifosSection');

misGifosBtn.addEventListener('click', () => {
    misGifosSection.classList.remove('hiddenClass');
    introductionSection.classList.add('hiddenClass');
    misGifosBtn.classList.add('activeTab');
    misGifosCtn.innerHTML = '';
    showGifos(misGifosArray, misGifosCtn);

    if(!favoritosSection.classList.contains('hiddenClass')){

        favoritosSection.classList.add('hiddenClass');
        favoritosBtn.classList.remove('activeTab');

    }else if(!createGifSection.classList.contains('hiddenClass')) {

        createGifSection.classList.add('hiddenClass');
        btnCrearGifo.classList.remove('activeBtn');
        trendingSection.classList.remove('hiddenClass');

    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        resultsSection.classList.add('hiddenClass');
        
    }
    menuBtn.checked = false;
});

//seccion para crear gifos
let btnCrearGifo = document.getElementById('btnCrearGifo');
let createGifSection = document.getElementById('createGifSection');

btnCrearGifo.addEventListener('click', () => {
    createGifSection.classList.remove('hiddenClass');
    btnCrearGifo.classList.add('activeBtn');
    introductionSection.classList.add('hiddenClass');
    trendingSection.classList.add('hiddenClass');

    if(!favoritosSection.classList.contains('hiddenClass')){

        favoritosSection.classList.add('hiddenClass');
        favoritosBtn.classList.remove('activeTab');

    }else if(!misGifosSection.classList.contains('hiddenClass')){

        misGifosSection.classList.add('hiddenClass');
        misGifosBtn.classList.remove('activeTab');
        
    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        resultsSection.classList.add('hiddenClass');
        
    }
});

//seccion home - logo
let home = document.getElementById('logo');

home.addEventListener('click', () => {
    introductionSection.classList.remove('hiddenClass');
    trendingSection.classList.remove('hiddenClass');

    if(!favoritosSection.classList.contains('hiddenClass')){

        favoritosSection.classList.add('hiddenClass');
        favoritosBtn.classList.remove('activeTab');

    }else if(!misGifosSection.classList.contains('hiddenClass')){

        misGifosSection.classList.add('hiddenClass');
        misGifosBtn.classList.remove('activeTab');

    }else if(!createGifSection.classList.contains('hiddenClass')) {

        createGifSection.classList.add('hiddenClass');
        btnCrearGifo.classList.remove('activeBtn');

    }else if(!searchResultsSection.classList.contains('hiddenClass')){

        resultsSection.classList.add('hiddenClass');
        
    }
    menuBtn.checked = false;
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