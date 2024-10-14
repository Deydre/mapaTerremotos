// navigator.geolocation.getCurrentPosition();
//creamos vbles globales
let titulo;
let fecha;
let ubicacion;
let codigo;
let magnitud;
let resultados;
let fechaConv;

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);
    });
} else {
    console.warn("Tu navegador no soporta Geolocalización!! ");
}


// Obtener datos
async function obtainData() {
    let response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson");
    let data = await response.json();
    resultados = data.features;
    titulo = resultados.map(feature => feature.properties.title);
    fecha = resultados.map(feature => feature.properties.time);
    fechaConv = new Date(fecha).toString();

    ubicacion = resultados.map(feature => feature.geometry.coordinates);
    codigo = resultados.map(feature => feature.properties.code);
    magnitud = resultados.map(feature => feature.properties.mag);

    return { resultados, titulo, fecha, ubicacion, codigo, magnitud }

}

// Clase para crear iconos
let LeafIcon = L.Icon.extend({
    options: {
        iconUrl: '/media/0.png',
        iconSize: [26, 38],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
});

// Creación de iconos
let icon0 = new LeafIcon({ iconUrl: '/media/0.png' });
let icon1 = new LeafIcon({ iconUrl: '/media/1.png' });
let icon2 = new LeafIcon({ iconUrl: '/media/2.png' });
let icon3 = new LeafIcon({ iconUrl: '/media/3.png' });
let icon4 = new LeafIcon({ iconUrl: '/media/4.png' });
let icon5 = new LeafIcon({ iconUrl: '/media/5.png' });
let icon6 = new LeafIcon({ iconUrl: '/media/6.png' });
let icon7 = new LeafIcon({ iconUrl: '/media/7.png' });

let varIcon;

// Pintar en el DOM
async function injectMap() {
    await obtainData();
    console.log(fechaConv);
    for (let i = 0; i < ubicacion.length; i++) {

        magnitud[i] > 0 && magnitud[i] < 1 ? varIcon = icon0 : "";
        magnitud[i] > 1 && magnitud[i] < 2 ? varIcon = icon1 : "";
        magnitud[i] > 2 && magnitud[i] < 3 ? varIcon = icon2 : "";
        magnitud[i] > 3 && magnitud[i] < 4 ? varIcon = icon3 : "";
        magnitud[i] > 4 && magnitud[i] < 5 ? varIcon = icon4 : "";
        magnitud[i] > 5 && magnitud[i] < 6 ? varIcon = icon5 : "";
        magnitud[i] > 6 && magnitud[i] < 7 ? varIcon = icon6 : "";
        magnitud[i] > 7 && magnitud[i] < 8 ? varIcon = icon7 : "";

        const marcadores = L.marker([ubicacion[i][1], ubicacion[i][0]], { icon: varIcon }).addTo(map)
        let popupContent = `<p>Título<br />${titulo[i]}</p>
                        <p>Ubicación<br />${[ubicacion[i]]}</p>
                        <p>Código<br />${codigo[i]}</p>
                        <p>Fecha<br />${fecha[i]}</p>
                        <p>Magnitud en escala Richter:<br />${magnitud[i]}</p>`
        marcadores.bindPopup(popupContent).openPopup()

    }

}

injectMap();

// MAPA
var map = L.map('map').setView([28.666666666667, -17.866666666667], 1);

L.tileLayer.provider('Stadia.AlidadeSmoothDark').addTo(map);
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 100,
    maxZoom: 100,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
});
