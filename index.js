"use strict"
window.addEventListener('DOMContentLoaded', () => {

    // mobile or pc devices
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return(
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        }
    };
    
    if (isMobile.any()) {
        document.body.classList.add('touch');

        const menuArrows = document.querySelectorAll('.menu-arrow');
        if(menuArrows.length > 0 ){
            menuArrows.forEach(arrow => arrow.addEventListener('click', (e) => {
                arrow.parentElement.classList.toggle('active');
            }));
        }
    } else {
        document.body.classList.add('pc');
    }
    // scroll to section 
    const menuLinks = document.querySelectorAll('.header-link[data-goto]'),
          logo = document.querySelector('.header-logo'),
          menuSublinks = document.querySelectorAll('.header-sublink[data-goto]'),
          burgerBtn = document.querySelector('.header-icon'),
          burgerMenu = document.querySelector('.header-nav');
    
    if(menuLinks.length > 0) menuLinks.forEach( link => link.addEventListener('click', onMenuClick));
    if(menuSublinks.length > 0) menuSublinks.forEach( link => link.addEventListener('click', onMenuClick));
    if(logo) logo.addEventListener('click', onMenuClick);
    if(burgerBtn){
        burgerBtn.addEventListener('click', (e) => {
            burgerMenu.classList.toggle('active');
            burgerBtn.classList.toggle('active')
            document.body.classList.toggle('lock');
    });
    }

    function onMenuClick(e){
        const menuLink = e.target;
        if(menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)){
            const gotoBlock = document.querySelector(menuLink.dataset.goto);
            const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('.header').offsetHeight;
            if(burgerBtn.classList.contains('active')){
                burgerMenu.classList.remove('active');
                burgerBtn.classList.remove('active')
                document.body.classList.remove('lock');
            }
            window.scrollTo({
                top: gotoBlockValue,
                behavior: "smooth"
            });
        }
        e.preventDefault();
    }

    //weather
    function weather () {
        const weatherKharkov = document.querySelector('#weather-1'),
          weatherKyiv = document.querySelector('#weather-2'),
          weatherLondon = document.querySelector('#weather-3');

        if (weatherKharkov) loadWeather("Kharkiv", weatherKharkov)
        if (weatherKyiv) loadWeather("Kyiv", weatherKyiv);
        if (weatherLondon) loadWeather("london", weatherLondon);

        async function loadWeather (city, weatherBlock) {
            weatherBlock.innerHTML = `
                <div class="weather-loading">
                    <img src="img/load.gif" alt="loading....">
                </div>
            `
            const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=ae37d0f34c22fd9a903d82d1b960b5e6`;

            const response = await fetch(server, {
                method: 'GET',
            });
            const responseResult = await response.json();
            if (response.ok) {
                getWeather(responseResult, weatherBlock);
            } else {
                weatherBlock.innerHTML = responseResult.message;
            }
        }

        function getWeather (data, weatherBlock) {
            const location = data.name,
                temp = Math.round(data.main.temp),
                feelsLike = Math.round(data.main.feels_like),
                weatherStatus = data.weather[0].main,
                weatherIcon = data.weather[0].icon; 
            
            const template = `
                <div class="weather-header">
                    <div class="weather-main">
                        <div class="weather-city-name">${location}</div>
                        <div class="weather-status">${weatherStatus}</div>
                    </div>
                    <div class="wheather-icon">
                        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="${weatherIcon}">
                    </div>
                </div>
                <div class="wheather-temp"><span>${temp}</span></div>
                <div class="weather-feels-like">Fells like: <span>${feelsLike}</span></div>
            `
            weatherBlock.innerHTML = template;
        }

    }
    weather();

    // timer
    function timer () {
        const deadTime = '2023-11-31T23:59:59.214Z';

        function getTime(endtimes){
            const  t = Date.parse(endtimes) - Date.parse(new Date()),
                    days = Math.floor(t / (1000 * 60 * 60 * 24) ),
                    hours = Math.floor((t / (100 * 60 * 60 )) % 24),
                    minutes = Math.floor((t / (1000 * 60)) % 60),
                    seconds = Math.floor((t / 1000) % 60);
    
            return{
                "total": t,
                "days": days,
                "hours": hours,
                "minutes": minutes,
                "seconds": seconds
            };   
        }

        function zero (num) {
            if ( num <= 9 && num > 0) {
                return`0${num}`;
            } else {
                return num;
            }
        }

        function setClocks (select, endtimes){
            const timer = document.querySelector(select),
                  day = timer.querySelector('#days'),
                  hour = timer.querySelector('#hours'),
                  minut = timer.querySelector('#minutes'),
                  second = timer.querySelector('#seconds'),
                  interval = setInterval(updateClocks, 1000);
            
            updateClocks();
    
            function updateClocks(){
                const t = getTime(endtimes);
                    day.innerHTML = zero(t.days);
                    hour.innerHTML = zero(t.hours);
                    minut.innerHTML = zero(t.minutes);
                    second.innerHTML = zero(t.seconds);
                
            if(t.total <= 0 ){
                clearInterval(interval);
                day.innerHTML = "0";
                hour.innerHTML = "0";
                minut.innerHTML = "0";
                second.innerHTML = "0";
                }  
            }     
        }
        setClocks(".timer", deadTime);
    }
    timer();

    // form
    function formFunction () {
        const form = document.querySelector('#form');
        const systemMessage = {
            errorValueInput: '<span>Заполните обязательные поля</span> ' ,
            errorLoadForm: '<span> Ошибка отправки данных. Пожалуйста попробуйте позже</span>'  ,
        }
        
        if (form) form.addEventListener("submit", formSend)
        
        async function formSend(e){
            e.preventDefault();
            
            let error = formValidate(form) ;
            
            let formData = new FormData(form);
            formData.append('image', formImage.files[0]);
            
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            if (error === 0) {
                form.classList.add('sending');
                
                let response = await fetch('../../serv.json', {
                    method: 'POST',
                    body:  formData ,
                });
                if(response.ok){

                    let result = await response.json();
                    alert(result.message);
                    formPreview.innerHTML = '';
                    form.reset();
                    form.classList.remove('sending');
                } else {
                    errorMessage.innerHTML = systemMessage.errorLoadForm;
                    form.append(errorMessage);
                    form.classList.remove('sending');
                    setTimeout(() => {
                        errorMessage.remove();
                    }, 3000) ;
                } 
            } else {
                errorMessage.innerHTML = systemMessage.errorValueInput;
                form.append(errorMessage);
                setTimeout(() => {
                    errorMessage.remove();
                }, 2000) ;
            }
        }

        function formValidate(form){
            let error = 0;
            let formReq = document.querySelectorAll('.req');

            formReq.forEach( input => {

                formRemoveError(input);
                if (input.classList.contains('email')) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.getAttribute("type") === "checkbox" && input.checked === false){
                    formAddError(input);
                    error++;
                } else {
                    if (input.value === '') {
                        formAddError(input);
                        error++;
                    }
                }
            })
            return error;
        }

        function formAddError (input) {
            input.parentElement.classList.add('error');
            input.classList.add('error');
        }

        function formRemoveError (input) {
            input.parentElement.classList.remove('error');
            input.classList.remove('error');
        }

        function emailTest (input) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
        }

        const formImage = document.getElementById('formImage');
        const formPreview = document.getElementById('formPreview');

        formImage.addEventListener('change', () => {
            uploadFile(formImage.files[0]);
        })

        function uploadFile(file){

            if(!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)){
                alert('Разрешены только изображения.');
                formImage.value = '';
                return
            }
            if(file.size > 2 * 1024 * 1024){
                alert('Файл должен быть меньше 2 МБ.');
                return
            }

            let reader = new FileReader();
            reader.onload = function (e) {
                formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото"></img>`;
            };
            reader.onerror = function (e) {
                alert('Ошибка');
            };
            reader.readAsDataURL(file)
        }
    }
    formFunction();

    // card
    function card () {
        const loadMoreCardButton = document.querySelector('.button-more-card');
        if (loadMoreCardButton) loadMoreCardButton.addEventListener('click', loadMoreCard);

        function loadMoreCard () {
            loadMoreCardButton.classList.toggle('active')
            const newCard = document.querySelectorAll('#hiden-card')
            newCard.forEach( card => {
                    card.classList.toggle('card-hidden');
                    card.classList.toggle('card-active');
            })
        }

    }
    card();
    
 // slider
    function slider () {
        const slides = document.querySelectorAll(".slide-item"),  
          prev = document.querySelector(".arrow-left"),  
          next = document.querySelector(".arrow-right"),  
          slidesWrapper = document.querySelector(".slider"),  
          slidesField = document.querySelector(".slides"),     
          width = parseInt(window.getComputedStyle(slidesWrapper).width); 

        let slideIndex = 1; 
        let offset = 0;     

        if (prev) prev.addEventListener('click', prevSlide);
        if (next) next.addEventListener('click', nextSlide)
        if (slides) slides.forEach(slide => slide.style.width = width);

        slidesField.style.width = 100 * slides.length + '%';   
        slidesField.style.transition = 'all 0.7s ease';            

        function nextSlide () {    
            if (offset == width * (slides.length -1)) {      
                offset = 0;                       
            } else {
                offset += width;  
            }
            slidesField.style.transform = `translateX(-${offset}px)`;

            if (slideIndex == slides.length) {          
                slideIndex = 1;
            } else {
                slideIndex++;                          
            }
        }

        function prevSlide () {    
            if (offset == 0) {      
                offset = width * (slides.length -1);  
            } else {
                offset -= width; 
            }
            slidesField.style.transform = `translateX(-${offset}px)`;  

            if (slideIndex == 1) {            
                slideIndex = slides.length;
            } else {
                slideIndex--;              
            }
        }
    }
    slider();

 // animate scroll
    const animateElem = document.querySelectorAll('.animate-item');

    if (animateElem.length > 0)  window.addEventListener('scroll', scrollAnimate);

    function scrollAnimate(){
        animateElem.forEach(item => {
            const animItem = item,
                    animItemHeight = animItem.offsetHeight,
                    animItemOffset = offsetFunc(animItem).top,
                    animStart = 4;

            let animItemPoint = window.innerHeight - animItemHeight / animStart;
            if(animItemHeight > window.innerHeight ){
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }

            if((pageYOffset > animItemOffset - animItemPoint) &&  pageYOffset < (animItemOffset + animItemHeight)){
                animItem.classList.add('anim-active');
            }else{
                animItem.classList.remove('anim-active');
            }
        })
    }

    function offsetFunc(el){
        const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
    setTimeout(() => {
        scrollAnimate();
    }, 500)
    
    // User theme (dark or light)
    window.addEventListener('load', windowLoad);

    function windowLoad () {
        const htmlBlock = document.documentElement,
              saveUserTheme = localStorage.getItem('user-theme');

        let userTheme;
        if(window.matchMedia){
            userTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            !saveUserTheme ? changeTheme() : null;
        });

        const themeButton = document.querySelector('.page-theme'),
              resetutton = document.querySelector('.page-reset');
            
        if (themeButton) {
            themeButton.addEventListener('click', () => {
                resetutton.classList.add('active');
                changeTheme(true)
            })
        }
        if (resetutton) {
            resetutton.addEventListener('click', () => {
                resetutton.classList.remove('active');
                localStorage.setItem('user-theme', '');
            });
        }

        function setThemeClass () {
            if (saveUserTheme){
                htmlBlock.classList.add(saveUserTheme);
                resetutton.classList.add('active');
            } else {
                htmlBlock.classList.add(userTheme)
            }
        }
        setThemeClass();

        function changeTheme (saveTheme = false) {
            let currentTheme = htmlBlock.classList.contains('light') ? 'light' : 'dark';
            let newTheme;

            if (currentTheme === 'light'){
                newTheme = 'dark';
            } else if (currentTheme === 'dark') {
                newTheme = 'light'
            }
            htmlBlock.classList.remove(currentTheme);
            htmlBlock.classList.add(newTheme);
            saveTheme ? localStorage.setItem('user-theme', newTheme) : null;
        }
    }

    // scroll arrow
    const arrowScroll = document.querySelector('.arrow-scroll');

    if (arrowScroll)  arrowScroll.addEventListener('click', onMenuClick);

    window.addEventListener('scroll', showArrowScroll);

    function showArrowScroll () {
        let documentScrollHeight = window.scrollY;
        
        if (documentScrollHeight > 2000) {
            arrowScroll.classList.add('arrow-active');
        } else {
            arrowScroll.classList.remove('arrow-active');
        }
    }

});
