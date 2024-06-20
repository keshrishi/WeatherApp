const userTab = document.querySelector("[data-userWeather]");
const SearchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const Searchform = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// initial variables
const API_KEY = "acec4bff5a722bb91db6a590d8dae764";
let currentTab = userTab;
currentTab.classList.add("current-Tab");
getFromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-Tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-Tab");
    
    if(!Searchform.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        Searchform.classList.add("active");
    } else {
        Searchform.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromSessionStorage(); 

    }
} 

}
userTab.addEventListener("click",() =>  {
    // pass clicked tab as input parameter
    switchTab(userTab);
});
SearchTab.addEventListener("click",() => {
    // pass clicked tab as input parameter
    switchTab(SearchTab);
})
// check if coordinates are present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // if coordinates not available the make grant access visible
        grantAccessContainer.classList.add("active");
    } else {
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}
async function fetchWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // api call
    try {   
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch(err){
        // loading screen remove
        loadingScreen.classList.remove("active");
        console.error("Error fetching weather info:", err);
        alert("Error: Unable to fetch weather information. Please try again later.");
    }
}

function renderWeatherInfo(data){
    // first fetching the elements
    const cityName = document.querySelector("[data-cityname]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-clouds]");
    //  fetch values and put the value

    cityName.innerText = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity} %`;
    cloudiness.innerText = `${data?.clouds?.all} %`;

}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        // show an alert for no geolocation supproted
        alert("Error!\n In finding locations");
    }
}
function showPosition (position){
    
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const grantAccessBtn = document.querySelector(".btn");
grantAccessBtn.addEventListener("click",getLocation);

let searchInput = document.querySelector("[data-searchinput]")

Searchform.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") return;
    else
    fetchSearchWeatherInfo(cityName);   

});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (err){
        // hw
        loadingScreen.classList.remove("active");
        console.error("Error fetching search weather info:", err);
        alert("Error: Unable to fetch weather information for the entered location. Please check the city name and try again.");

    }
}
















// function renderWeatherInfo(data) {
//     let newPara = document.createElement('p');
//         newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//         document.body.appendChild(newPara);
// }
// async function showWeather() {
//     try{
//         let city = "Muzaffarpur";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API}&units=metric`);
//         const data = await response.json();
//         console.log("Weather data -> " , data);
    
//         renderWeatherInfo(data);

//     } catch(err){
//         console.log("Error found" , err);
//     }
// }
// async function getCustomWeatherDetails(latitude,longitude) {
//     try{
//         // let latitude = 17.6333;
//         // let longitude = 18.3333;
    
//         let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?
//                                 lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`);
    
//         let data = await result.json();
    
//         console.log(data);
//         renderWeatherInfo(data);
//     }
//     catch(err) {
//         console.log("Errror Found" , err);
//     }

// }

// function getLocation() {
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     } else {
//         console.log("No Geolocation found");
//     }
// }
// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;

//     console.log(lat);
//     console.log(longi);
//     getCustomWeatherDetails(lat,longi);
// }