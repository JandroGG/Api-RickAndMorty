class Personaje {
    constructor(created,episode,gender,id,image,location,name,origin,species,status,type,url) {
        this.created = created;
        this.episode = episode;
        this.gender = gender;
        this.id = id;
        this.image = image;
        this.location = location;
        this.name = name;
        this.origin = origin; 
        this.species = species;
        this.status = status;
        this.type = type;
        this.url = url;
    }
}

let pagina = 0;
let index = 0;
let url = "https://rickandmortyapi.com/api/character";
let data;
let mostrarCharInfoIsDone = false;

let personajesSerie=[];

document.addEventListener("DOMContentLoaded", () => {
    fetchAlmacenaData();
});

const fetchAlmacenaData = async () => {
    try{
        while(pagina < 42){
            const res = await fetch(url);
            data = await res.json();
            almacenarData(data);
            url = data.info.next;
            pagina = pagina+1;
            data=[];
        }
        index = 0;
        console.log('fin almacenamiento de personajes');
        displayCards(personajesSerie);
    }
    catch(error){
        console.log(error);
    }
}

function almacenarData(data){
    
    data.results.forEach((item) => {
        personajesSerie.push(new Personaje);
        personajesSerie[index] = item;
        index++;
    });
}
// "contenedor-carnets"

function displayCards(personajes){

    const itemsPorPagina = 15;  //al cambiar este valor se debe cambiar la propiedad en el archivo CSS grid-template-rows: 33% 33% 33%; del scroll-page
    document.getElementById("cant-char-num").textContent = personajes.length;

    const totalPaginas = Math.floor(personajes.length/itemsPorPagina);
    const restoPersonajes = personajes.length - totalPaginas*itemsPorPagina;


    const listaCarnets = document.getElementById("contenedor-scroll");
    const template = document.getElementById("template-carnet").content;
    const fragment = document.createDocumentFragment();
    let k = 0;
    for(let i=1;i<=totalPaginas;i++){
        const scrollPage = document.createElement("scroll-page");
        scrollPage.setAttribute("id", "pagina-"+i);
        scrollPage.setAttribute("class", "scroll-page");
        for(let j=0;j<itemsPorPagina;j++){
            const clone = template.cloneNode(true);
            clone.querySelector(".carnet").setAttribute("id", "carnet-"+k);
            clone.querySelector(".Nombre").textContent = personajes[k].name;
            clone.querySelector(".especie").textContent = personajes[k].species;
            clone.querySelector(".identificador").textContent = personajes[k].id;
            clone.querySelector("img").setAttribute("src", personajes[k].image);
            if(personajes[k].status === "Alive"){
                clone.querySelector(".estado").style.backgroundColor = "limegreen"
            }
            else if(personajes[k].status === "Dead"){
                clone.querySelector(".estado").style.backgroundColor = "rgb(88, 4, 4)";
            }
            else if(personajes[k].status === "unknown"){
                clone.querySelector(".estado").style.backgroundColor = "rgb(88, 84, 84)";
            }
            fragment.appendChild(clone);
            k++;
        }
        scrollPage.appendChild(fragment);
        listaCarnets.appendChild(scrollPage);
    }
    // completar el resto de personajes:
    const scrollPage = document.createElement("scroll-page");
    scrollPage.setAttribute("id", "pagina-"+(totalPaginas+1));
    scrollPage.setAttribute("class", "scroll-page");
    for(let j=0;j<restoPersonajes;j++){
        const clone = template.cloneNode(true);
        clone.querySelector(".carnet").setAttribute("id", "carnet-"+k);
        clone.querySelector(".Nombre").textContent = personajes[k].name;
        // clone.querySelector(".estado").textContent = personajes[k].status;
        clone.querySelector(".especie").textContent = personajes[k].species;
        clone.querySelector(".identificador").textContent = personajes[k].id;
        clone.querySelector("img").setAttribute("src", personajes[k].image);
        fragment.appendChild(clone);
        k++;
    }
    scrollPage.appendChild(fragment);
    listaCarnets.appendChild(scrollPage);


    let carnets = document.querySelectorAll(".carnet");
    carnets.forEach((item) => {
        item.addEventListener("click", displayInfo, true);
        item.style.cursor= "Pointer";
    });

}


function displayInfo(event){

    let listaCarnets = document.getElementById("contenedor-scroll");
    const idPersonaje = parseInt(event.target.parentElement.children[2].textContent)-1;

    if(!mostrarCharInfoIsDone){
        const templatetooltip = document.getElementById("template-tooltip").content;
        const fragmentTooltip = document.createDocumentFragment();
        const clonetooltip = templatetooltip.cloneNode(true);
        clonetooltip.querySelector(".img-tooltip").setAttribute("src", personajesSerie[idPersonaje].image);
        clonetooltip.getElementById("nombre-personaje").textContent = "Name: " + personajesSerie[idPersonaje].name;
        clonetooltip.getElementById("estado-personaje").textContent = "Status: " + personajesSerie[idPersonaje].status;
        clonetooltip.getElementById("genero-personaje").textContent = "Gender: " + personajesSerie[idPersonaje].gender;
        clonetooltip.getElementById("especie-personaje").textContent = "Species: " + personajesSerie[idPersonaje].species;
        clonetooltip.getElementById("origen-personaje").textContent = "Origin: " + personajesSerie[idPersonaje].origin.name;
        clonetooltip.getElementById("id-personaje").textContent = "Id: " + personajesSerie[idPersonaje].id;
        fragmentTooltip.appendChild(clonetooltip);
        listaCarnets.appendChild(fragmentTooltip);
        mostrarCharInfoIsDone = true;
        document.querySelector(".close-tooltip").addEventListener("click", cerrarTooltip, false);
        document.querySelector(".close-tooltip").addEventListener( "mouseover" , agrandaCerrarTooltip, false);
        document.querySelector(".close-tooltip").addEventListener( "mouseout" , reduceCerrarTooltip, false);
    }
    else{
        tooltipChar = document.querySelector(".tooltip-content");
        listaCarnets.removeChild(tooltipChar);
        mostrarCharInfoIsDone = false;
    }
}

function cerrarTooltip(){
    const tooltipChar = document.querySelector(".tooltip-content");
    const listaCarnets = document.getElementById("contenedor-scroll");
    listaCarnets.removeChild(tooltipChar);
    mostrarCharInfoIsDone = false;

}

function agrandaCerrarTooltip(){
    let botonCerrar = document.querySelector(".close-tooltip");
    botonCerrar.style.width = "6%";
}

function reduceCerrarTooltip(){
    let botonCerrar = document.querySelector(".close-tooltip");
    botonCerrar.style.width = "5%";
}

function imprimirCarnetsDeVivos(){
    limpiarPagina();
    const vivos = personajesSerie.filter( personaje => personaje.status === "Alive");
    displayCards(vivos);
}

function imprimirCarnetsDeMuertos(){

    limpiarPagina();
    const muertos = personajesSerie.filter( personaje => personaje.status === "Dead");
    displayCards(muertos);
}

function imprimirCarnetsDeNoseSeSabes(){

    limpiarPagina();
    const noseSeSabe = personajesSerie.filter( personaje => personaje.status === "unknown");
    displayCards(noseSeSabe);
}

function imprimirCarnetsDeTodos(){

    limpiarPagina();
    displayCards(personajesSerie);
}

function limpiarPagina(){
    listaCarnets = document.getElementById("contenedor-scroll");
    let carnets = document.querySelectorAll(".scroll-page");
    data=[];
    carnets.forEach((carnet) => listaCarnets.removeChild(carnet));
}

function paginasAnteriores(){
    let paginas = document.querySelectorAll(".pagina");
    paginas.forEach( (item)=> {
        let ancla = item.childNodes[0];
        let nuevoTextItem = parseInt(item.textContent) - 10;
        ancla.setAttribute("href", "#pagina-"+nuevoTextItem);
        ancla.textContent = nuevoTextItem;

        item.setAttribute("id", nuevoTextItem);
    });

    paginas[0].childNodes[0].textContent === '1' ? document.getElementById("pg-anterior").disabled = true : document.getElementById("pg-anterior").disabled = false;
    paginas[9].childNodes[0].textContent === '60' ? document.getElementById("pg-siguiente").disabled = true : document.getElementById("pg-siguiente").disabled = false;
}

function paginasSiguientes(){
    let paginas = document.querySelectorAll(".pagina");

    paginas.forEach( (item)=> {
        let ancla = item.childNodes[0];
        let nuevoTextItem = parseInt(item.textContent) + 10;

        ancla.setAttribute("href", "#pagina-"+nuevoTextItem);
        ancla.textContent = nuevoTextItem;

        item.setAttribute("id", nuevoTextItem);
    });

    paginas[0].childNodes[0].textContent === '1' ? document.getElementById("pg-anterior").disabled = true : document.getElementById("pg-anterior").disabled = false;
    paginas[9].childNodes[0].textContent === '60' ? document.getElementById("pg-siguiente").disabled = true : document.getElementById("pg-siguiente").disabled = false;
}

function _init(){
    const funcionFiltro = [imprimirCarnetsDeVivos, imprimirCarnetsDeMuertos, imprimirCarnetsDeNoseSeSabes,imprimirCarnetsDeTodos];
    let bontonesFiltrar = document.querySelectorAll(".btn-filtro");
    bontonesFiltrar.forEach( (item, index) => item.addEventListener("click", funcionFiltro[index], false) );

    document.getElementById("pg-anterior").addEventListener("click", paginasAnteriores,false);
    document.getElementById("pg-siguiente").addEventListener("click", paginasSiguientes,false);

    let pagina = document.getElementById("1");
    pagina.childNodes[0].textContent === '1' ? document.getElementById("pg-anterior").disabled = true : document.getElementById("pg-anterior").disabled = false;
}

window.addEventListener( "load" , _init, false);