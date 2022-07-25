import playList from './playList.js';

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
    if (localStorage.getItem('language') === 'rus'){
        date.textContent = new Date().toLocaleDateString('ru', options);
     } else {
        date.textContent = new Date().toLocaleDateString('en-US', options);
     }
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
    const placeholder = document.querySelector('.name_greeting')
    if (localStorage.getItem('language') === 'rus'){
        greetingField.textContent = `Добрый ${getTimeOfDay()}, `;
        placeholder.placeholder = '[введите ваше имя]'
     } else {
        greetingField.textContent = `Good ${getTimeOfDay()}, `;
        placeholder.placeholder = '[enter your name]'
     }
}

function getTimeOfDay(defaultV){
    const date = new Date();
    const hours = date.toLocaleString([], {
        hour12: false,
        hour: 'numeric',
      })
    let greetings = ['morning', 'afternoon', 'evening', 'night'];
    if (localStorage.getItem('language') === 'rus' && !defaultV){
       greetings = ['утро', 'день', 'вечер', 'ночь'];
    }
    if(hours >= 4 && hours < 10) return greetings[0]
    else if(hours >= 10 && hours < 16) return greetings[1]
    else if(hours >= 16 && hours < 22) return greetings[2]
    else return greetings[3]
}

function setLocalStorage() {
    const name = document.querySelector('.name')
    localStorage.setItem('name', name.value);
    
    const city = document.querySelector('.city')
  }

function getLocalStorage() {
    const name = document.querySelector('.name')
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
    if(localStorage.getItem('todoList')) {
        let todoList = document.querySelector('.todoList_items')
        todoList.innerHTML = localStorage.getItem('todoList')
        console.log(todoList)
        const todoListNew = document.querySelectorAll('.icono-check')
        todoListNew.forEach(el=>{
            el.addEventListener('click', event => {
                el.parentNode.remove()
                const todoListUpdated = document.querySelector('.todoList_items')
                localStorage.setItem('todoList', todoListUpdated.innerHTML)
            })
        })
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
async function setBg(){
    const timeOfDay = getTimeOfDay(1)
    const randomNumPad = (randomNum + '').padStart(2, "0"); 
    
    const img = new Image();
    if (localStorage.getItem('pictureAPI') === 'github'){
    img.src = `https://raw.githubusercontent.com/scalette/stage1-tasks/assets/images/${timeOfDay}/${randomNumPad}.jpg`
    }
    else if(localStorage.getItem('pictureAPI') === 'unsplash'){
        const unsplashAccesKey = 'EjA_Kj7TTHuQdA8v6Pk2AZTOmBYK5NiL97UxYEv8IVA'
        const pictureTag =  localStorage.getItem('picTag') || timeOfDay
        const unsplashURL = `https://api.unsplash.com/photos/random?orientation=landscape&query=${pictureTag}&client_id=${unsplashAccesKey}`
        const res = await fetch(unsplashURL);
        const data = await res.json();
        img.src = data.urls.regular;
    }
    else if(localStorage.getItem('pictureAPI') === 'flickr'){
        const unsplashAccesKey = 'b46afbf171e960fa8b2d09235c505782'
        const pictureTag =  localStorage.getItem('picTag') || timeOfDay
        const unsplashURL = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${unsplashAccesKey}&tags=${pictureTag}&extras=url_l&format=json&nojsoncallback=1`
        const res = await fetch(unsplashURL);
        const data = await res.json();
        img.src = data.photos.photo[Math.round(Math.random() * 100)].url_l;
    }
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
    }
}

const rightSlider = document.querySelector('.slide-next')
const leftSlider = document.querySelector('.slide-prev')
function getSlideNext(){
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
    const weatherDescriptionWind = document.querySelector('.wind');
    const weatherDescriptionHumidity = document.querySelector('.humidity');
    const city = document.querySelector('.city');

async function getWeather() {  
    const api = 'b5f3e48f73e5249293ea80d26fb34b7e'
    let lang = 'en'
    city.value = city.value ? city.value : 'Minsk'
    if (localStorage.getItem('language') === 'rus'){
        lang = 'ru'
     }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=${api}&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    if (localStorage.getItem('language') === 'rus'){
        weatherDescriptionWind.textContent = `ветер: ${Math.round(data.wind.speed)} м/с`;
        weatherDescriptionHumidity.textContent = `влажность: ${Math.round(data.main.humidity)}%`;
     }else{
         
    weatherDescriptionHumidity.textContent = `humidity: ${Math.round(data.main.humidity)}%`;
    weatherDescriptionWind.textContent = `wind: ${Math.round(data.wind.speed)} m/s`;
     }
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

// 5. QUOTES
const quoteRandom = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
async function getQuotes() {  
    if (localStorage.getItem('language') === 'rus'){
        const quotes = 'assets/quotes/quotesRus.json';
        const res = await fetch(quotes);
        const data = await res.json(); 
        const quotesRandom = getRandomNum(0, data.length-1)
        quote.textContent = data[quotesRandom].quote
        author.textContent = data[quotesRandom].author
     } else {    
     const quotes = 'assets/quotes/quotes.json';
     const res = await fetch(quotes);
     const data = await res.json(); 
     const quotesRandom = getRandomNum(0, data.length-1)
     quote.textContent = data[quotesRandom].quote
     author.textContent = data[quotesRandom].author
     }

  }
  
quoteRandom.addEventListener('click', getQuotes)
getQuotes();

// 6. AUDIO
const audioButtonPlayPause = document.querySelector('.play');
const audioButtonNext = document.querySelector('.play-next');
const audioButtonPrev = document.querySelector('.play-prev');
const audioNameDiv = document.querySelector('.audio_name')
let isPlay = false;
let playNum = 0;

const audio = new Audio();

function playAudio() {
  if (!isPlay){
    audio.src = playList[playNum].src
    audio.currentTime = 0;
    audio.play();
    audioNameDiv.textContent = playList[playNum].title
    isPlay = !isPlay
  }
  else{
    audio.pause();
    isPlay = !isPlay
  }
}
function playNext(){
    playNum = playNum === playList.length - 1 ? 0 : playNum+1
    if (!isPlay){
        playAudio()
        toggleBtn()
    }else{
        isPlay = !isPlay
        playAudio()
    }

}
function playPrev(){
    playNum = playNum === 0 ? playList.length - 1 : playNum-1
    if (!isPlay){
        playAudio()
        toggleBtn()
    }else{
        isPlay = !isPlay
        playAudio()
    }
}

function toggleBtn() {
    audioButtonPlayPause.classList.toggle('pause');
}
const playListContainer = document.querySelector('.play-list')
playList.forEach((el,num) => {
    const li = document.createElement('li');
    li.textContent = el.title
    li.setAttribute('track', num)
    li.classList.add('play-item')
    playListContainer.append(li) 
    li.addEventListener('click', ()=>{
        playNum = +li.getAttribute('track')
        if (!isPlay){
            playAudio()
            toggleBtn()
        }else{
            isPlay = !isPlay
            playAudio()
        }
    })
})



audioButtonPlayPause.addEventListener('click', toggleBtn);
audioButtonPlayPause.addEventListener('click', playAudio);
audioButtonNext.addEventListener('click', playNext);
audioButtonPrev.addEventListener('click', playPrev);

//click volume slider to change volume
const audioPlayer = document.querySelector(".audio-player");
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

audio.addEventListener(
    "loadeddata",
    () => {
      audioPlayer.querySelector(".audio_time .length").textContent = getTimeCodeFromNum(
        audio.duration
      );
      audio.volume = .75;
    },
    false
  );
//turn seconds into time format
function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
  
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
  }
  
//check audio percentage and update time accordingly
setInterval(() => {
    const progressBar = audioPlayer.querySelector(".progress");
    progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
    audioPlayer.querySelector(".audio_time .current").textContent = getTimeCodeFromNum(
      audio.currentTime
    );
  }, 500);

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);

//settings
const settingsField = document.querySelector('.settings_menu')
const settings = document.querySelector('.icono-sliders')

document.addEventListener('click', (el)=> {
    if(!el.path.includes(settingsField) && 
        !Array.from(settingsField.classList).includes('class_hidden') &&
        Array.from(settings.classList).includes('class_hidden')){
    settings.classList.toggle('class_hidden')
    settingsField.classList.toggle('class_hidden')
    }
}, true)

settings.addEventListener('click', ()=>{
    settings.classList.toggle('class_hidden')
    settingsField.classList.toggle('class_hidden')
})

const buttonsLanguage = document.querySelectorAll('.button_language')
const buttonsPicturesAPI = document.querySelectorAll('.button_background')
const button_tag = document.querySelector('.button_tag')

button_tag.addEventListener('focusout', ()=>{
    localStorage.setItem('picTag', button_tag.value);
})

buttonsLanguage.forEach((el)=>{
    el.addEventListener('click', (event)=> {
        localStorage.setItem('language', event.target.value);
        window.location.reload();
    })
})

buttonsPicturesAPI.forEach((el)=>{
    el.addEventListener('click', (event)=> {
        localStorage.setItem('pictureAPI', event.target.value);
    })
})
//todo list
const todoListIcon =  document.querySelector('.icono-comment')
const todoListField = document.querySelector('.todo_list')

document.addEventListener('click', (el)=> {
    if(!el.path.includes(todoListField) && 
        !Array.from(todoListField.classList).includes('icono-comment') &&
        Array.from(todoListIcon.classList).includes('class_hidden')){
            todoListIcon.classList.toggle('class_hidden')
            todoListField.classList.toggle('class_hidden')
    }
}, true)

todoListIcon.addEventListener('click', ()=>{
    todoListIcon.classList.toggle('class_hidden')
    todoListField.classList.toggle('class_hidden')
})

const todoPlus = document.querySelector('.icono-plus')


todoPlus.addEventListener('click', ()=>{
    const text = document.querySelector('.todo_list_text')
    console.log(text.value)
    const div = document.createElement('div')
    div.classList.add('todoList_item')
    const divIcon = document.createElement('div')
    divIcon.classList.add('icono-check')
    div.textContent = text.value;
    div.appendChild(divIcon);
    div.addEventListener('click', ()=>{
        div.remove()
    })
    const todoListItems = document.querySelector('.todoList_items')
    todoListItems.appendChild(div);
    let todoList = document.querySelector('.todoList_items')
    localStorage.setItem('todoList', todoList.innerHTML)
})

runApp();