
window.addEventListener("load", () => {

    document.querySelector("#loader1").style.display="block";

    let long;
    let lat;

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=78bcad0d429cad5887a2cef2e1c5d77e`;

            fetch(api)
            .then((response) => {
                return response.json();
            })
            .then(data => {

                const toCelsius = Math.round(`${data.main.temp}`)- 273;
                const currentWeather = `
                <div class="current-weather-info">
                    <p class="city-name">${data.name}, ${data.sys.country}</p>
                    <div class="img-and-temp">
                        <div class="weather-type-img"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Image of the current weather-type" /></div>
                        <span class="current-temp">${toCelsius}&#176;C</span>
                    </div>
                    <p class="weather-type">${data.weather[0].main}</p>
                </div>`;

                document.querySelector("#loader1").style.display="none";
                document.querySelector(".responseData").innerHTML = currentWeather;
                displaySearchWeather();

            }) 
            
        })
    }
})


var addCity = document.getElementById("addCity");
var modalBox = document.querySelector(".modalBox");
var inputContainer = document.querySelector(".input-container");
var inputBox = document.querySelector(".inputBox");
var cityInput = document.getElementById("cityInput");
var searchResults = document.querySelector(".searchCityItems");


addCity.addEventListener("click", () => {

    modalBox.style.display="block";
    inputContainer.style.transform="translateY(7vh)";
    inputBox.style.display="flex";
});

modalBox.addEventListener("click", () => { 
    displaySearchWeather();
    searchResults.style.display="none";
    inputContainer.style.transform="translateY(-50vh)";
    modalBox.style.display="none";
});

let submitCityInfo = (e) => {

    e.preventDefault();
    
    searchResults.style.display="none";
    document.querySelector(".loaderBox2").style.display="flex";

    let output = "";

    fetch(`https://fierce-castle-13645.herokuapp.com/weather?city=${cityInput.value}`)
        .then(res => res.json())
        .then(response => {
            cityInput.value = "";
            response.forEach((response) => {
    
                    output += `
                    <div class="cityItem" onclick="displaySearchWeather(setId(${response.id}))">
                        <i class="fas fa-map-marker-alt"></i>
                        <p class="city-and-country">${response.name}, ${response.country}</p>
                    </div>`;

            })
            document.querySelector(".loaderBox2").style.display="none";
            searchResults.innerHTML = output;
            searchResults.style.display="flex";
        })
        .catch(err => {

            document.querySelector(".loaderBox2").style.display="none";
            searchResults.style.display="flex";
            document.querySelector(".error").style.display="block";
        });
}

inputBox.addEventListener("submit", submitCityInfo);

// SETTING UP LOCAL STORAGE FOR IDS

function setId(id){

    if(localStorage.getItem("id") === null){
        localStorage.setItem("id", "[]");
    }
    
    var id_value = [...JSON.parse(localStorage.getItem("id"))];
    id_value.push(id);
    
    localStorage.setItem("id", JSON.stringify(id_value));

    // CLOSING THE MODAL

    searchResults.style.display="none";
    inputContainer.style.transform="translateY(-50vh)";
    modalBox.style.display="none";
}


async function displaySearchWeather(){

    if(localStorage.getItem("id") === null){
        document.querySelector(".loader-and-notice").style.display="block";
        document.getElementById("loader3").style.display="none";
        document.querySelector(".savedLocationNotice").style.display="block";
       
    }else{

        document.querySelector(".loader-and-notice").style.display="block";
        document.querySelector(".savedLocationNotice").style.display="none";
        document.getElementById("loader3").style.display="block";
        document.querySelector(".search-location-list").style.display="none";

        let id_value = [...JSON.parse(localStorage.getItem("id"))];
        let getWeatherInfo = "";

        //Looping fetch api using id

        for(let i = 0; i < id_value.length; i++){
            let resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id_value[i]}&appid=78bcad0d429cad5887a2cef2e1c5d77e`);
            let data = await resp.json();
    
            let toCelsius = Math.round(`${data.main.temp}`)- 273;

            getWeatherInfo += `
            <div class="searched-city-item">

                <p class="cityCountryName">${data.name}, ${data.sys.country}</p>
            
                <div class="weatherTypeImgNTemp">
                    <div class="weatherTypeNImg">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                        <p class="weather-descrip">${data.weather[0].main}</p>
                    </div>
            
                    <span class="temperature">${toCelsius}&#176;C</span>
                </div>
            
            </div>`;

        }
        
        document.querySelector(".loader-and-notice").style.display="none";
        document.getElementById("loader3").style.display="none";

        document.querySelector(".search-location-list").innerHTML = getWeatherInfo;
        document.querySelector(".search-location-list").style.display="block";
    }

}