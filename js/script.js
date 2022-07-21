function showTime(){
    const time = document.querySelector('.time')
    time.textContent = new Date().toLocaleTimeString([],{
        hour12: false, 
    });
}
function showDate(){
    const date = document.querySelector('.date');
    const options = {
        weekday: 'long', 
        month: 'long',
        day: 'numeric',
    };
    date.textContent = new Date().toLocaleDateString('en-US', options);
}

function showDateTime(){
    showTime();
    showDate();
    showGreeting()
    setTimeout(showDateTime, 1000);
}

function runApp(){
    showDateTime();
}

function showGreeting(){
    const greetingField = document.querySelector('.greeting')
    greetingField.textContent = `Good ${getTimeOfDay()}, `;
}

function getTimeOfDay(){
    const date = new Date();
    const hours = date.toLocaleString([], {
        hour12: false,
        hour: 'numeric',
      })
    const greetings = ['morning', 'afternoon', 'evening', 'night'];
    if(hours >= 4 && hours < 10) return greetings[0]
    else if(hours >= 10 && hours < 16) return greetings[1]
    else if(hours >= 16 && hours < 22) return greetings[2]
    else return greetings[3]
}

function setLocalStorage() {
    const name = document.querySelector('.name')
    localStorage.setItem('name', name.value);
    
    const city = document.querySelector('.city')
    localStorage.setItem('city', city.value);
  }

function getLocalStorage() {
    const name = document.querySelector('.name')
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
}
window.addEventListener('load', getLocalStorage)
window.addEventListener('beforeunload', setLocalStorage)

// 3. SLIDER, BACKGROUND
let randomNum = +(getRandomNum(1,20) + '').padStart(2, "0");

function getRandomNum(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}
console.log(getRandomNum(1,20));
function setBg(){
    const timeOfDay = getTimeOfDay()
    const randomNumPad = (randomNum + '').padStart(2, "0"); 
    console.log(timeOfDay, randomNumPad)
    
    const img = new Image();
    img.src = `https://github.com/scalette/stage1-tasks/tree/assets/images/${timeOfDay}/${randomNumPad}.jpg`
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
    }
}

const rightSlider = document.querySelector('.slide-next')
const leftSlider = document.querySelector('.slide-prev')
function getSlideNext(){
    console.log(typeof randomNum)
    randomNum = randomNum === 20 ? 1 : randomNum+1
    setBg();
}
function getSlidePrev(){
    randomNum = randomNum === 1 ? 20 : randomNum-1
    setBg();
}
rightSlider.addEventListener('click', getSlideNext)
leftSlider.addEventListener('click', getSlidePrev)
setBg();

//4.Weather    
    const weatherIcon = document.querySelector('.weather-icon');
    const temperature = document.querySelector('.temperature');
    const weatherDescription = document.querySelector('.weather-description');
    const city = document.querySelector('.city');

async function getWeather() {  
    const api = 'b5f3e48f73e5249293ea80d26fb34b7e'
    const lang = 'en'
    city.value = city.value ? city.value : 'Minsk'
    console.log('content', city.value)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=${api}&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    console.log(data.weather[0].id, data.weather[0].description, data.main.temp);
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
  }

function setCity(event){
    if(event.code === 'Enter'){
        getWeather();
        city.blur();
    }
}
document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity)
runApp();