"use sctrict"
window.addEventListener('DOMContentLoaded', () => {
    
    // mobile or pc
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
    } else {
        document.body.classList.add('pc');
    }
    // Tabs
    function tabs () {
        const tabsBtn = document.querySelectorAll('.tab-title'),
                tabs = document.querySelectorAll('section');
    
        if ( tabsBtn.length > 0 ) {
            tabsBtn[0].classList.add('active');
            tabs.forEach(tab => tab.classList.add('_section-hide'));
            tabs[0].classList.remove('_section-hide');
            tabs[0].classList.add('_section-show');

            tabsBtn.forEach((btn, i) => btn.addEventListener('click', () => {
                tabsBtn.forEach(otherBtn => {
                    otherBtn.classList.remove('active');
                } );
                btn.classList.add('active');
                tabs.forEach(tab => tab.classList.remove('_section-show'));
                tabs.forEach(tab => tab.classList.add('_section-hide'));
                tabs[i].classList.remove('_section-hide');
                tabs[i].classList.add('_section-show');
                if (i == 1) slider();
            }));
        }   
    }
    tabs();
    //  slider
    function slider () {
        const slides = document.querySelectorAll(".slide"),  
                prev = document.querySelector("#prew-button"),  
                next = document.querySelector("#next-button"),  
                slidesWrapper = document.querySelector(".slider-wrapper"),  
                slidesField = document.querySelector(".slider-field"),     
                width = parseInt(window.getComputedStyle(slidesWrapper).width ); 

        let slideIndex = 1; 
        let offset = 0; 
        let autoplay = setInterval(nextSlide, 7000);
        
        if (slides.length > 0) slides.forEach(slide => slide.style.width = width +'px');
        if (next) next.addEventListener('click', nextSlide);
        if (prev) prev.addEventListener('click', prevSlide);
        if (slidesField) {
            slidesField.style.display = "flex"
            slidesField.style.width = 100 * slides.length  + '%';   
            slidesField.style.transition = 'all 0.7s ease'; 
            }           

        function prevSlide () {
            if (offset == 0) {      
                offset = width  * (slides.length -1) ;  
            } else {
                offset = offset - width; 
            }
            slidesField.style.transform = `translateX(-${offset}px)`;  
            
            if (slideIndex == 1) {            
                slideIndex = slides.length;
            } else {
                slideIndex--;              
            }
            if (slideIndex > 1) prev.classList.add('active')
            if (slideIndex == 1) prev.classList.remove('active')
            clearInterval(autoplay);
        }

        function nextSlide () {
            if (offset == width * (slides.length -1)) {      
                offset = 0;                       
            } else {
                offset = offset + width;  
            }
            slidesField.style.transform = `translateX(-${offset}px)`;
            
            if (slideIndex == slides.length) {          
                slideIndex = 1;
            } else {
                slideIndex++;                          
            }
            if (slideIndex > 1) prev.classList.add('active')
            if (slideIndex == 1) prev.classList.remove('active')
            clearInterval(autoplay);
        } 
        const images = document.querySelectorAll('.img-big'),
              sliders = document.querySelectorAll('._slider');

        if ( images.length > 0) {
            images.forEach((img) => {
                img.addEventListener('click', () => {
                    sliders.forEach(slider =>  {
                        if(img.dataset.slider == slider.dataset.slides ) {
                            sliders.forEach(otherslide => otherslide.classList.remove('active'));
                            slider.classList.add('active');
                        }
                    })
                });
            });
        }
    
        sliders.forEach(imageSlider =>  {
            const slides = imageSlider.querySelectorAll('.slide-slider'),
                prev = imageSlider.querySelector("#prew-button"),  
                next = imageSlider.querySelector("#next-button"),  
                sliderClose = imageSlider.querySelector('.slider-close'),
                slidesWrapper = imageSlider.querySelector(".slider-wrapper"),  
                slidesField = imageSlider.querySelector(".slider-field"),     
                width = parseInt(window.getComputedStyle(slidesWrapper).width ); 

            let slideIndex = 1; 
            let offset = 0; 
            if (sliderClose) sliderClose.addEventListener('click', () => imageSlider.classList.remove('active'));
            if (slides.length > 0) slides.forEach(slide => slide.style.width = width +'px');
            if (next) next.addEventListener('click', nextSlide);
            if (prev) prev.addEventListener('click', prevSlide);
            if (slidesField) {
                slidesField.style.display = "flex"
                slidesField.style.width = 100 * slides.length  + '%';   
                slidesField.style.transition = 'all 0.7s ease'; 
            }           
            
            function prevSlide () {
                if (offset == 0) {      
                    offset = width  * (slides.length -1) ;  
                } else {
                    offset = offset - width; 
                }
                slidesField.style.transform = `translateX(-${offset}px)`;  
                
                if (slideIndex == 1) {            
                    slideIndex = slides.length;
                } else {
                    slideIndex--;              
                }
                if (slideIndex > 1) prev.classList.add('active')
                if (slideIndex == 1) prev.classList.remove('active')
            }
            
            function nextSlide () {
                if (offset == width * (slides.length -1)) {      
                    offset = 0;                       
                } else {
                    offset = offset + width;  
                }
                slidesField.style.transform = `translateX(-${offset}px)`;
                
                if (slideIndex == slides.length) {          
                    slideIndex = 1;
                } else {
                    slideIndex++;                          
                }
                if (slideIndex > 1) prev.classList.add('active')
                if (slideIndex == 1) prev.classList.remove('active')
            }
        }) 
    }
    // form
    function  forms () {
        const form = document.forms[0],
              formMessage = document.querySelector('.form-message'),
              formSpinner = document.querySelector('.form-spinner');
              systemMessage = {
                errorValueInput: 'Fill in required fields!',
                errorLoadForm: 'Error sending data. Please try again later' ,
              };

        if (form) form.addEventListener('submit',  formSend);

        async function formSend (e) {
            e.preventDefault();

            let error = formValidate(form);  
            const url = "mailer/sendmail.php"
            const formData = new FormData(form);
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('_error-message');

            if(error == 0) {
                formSpinner.classList.add('active');
    
                let response = await fetch(url, {
                    method: 'POST',
                    body: formData,
                });
    
                form.reset();
    
                if (response.ok) {
                    formSpinner.classList.remove('active');
                    formMessage.classList.add('active');
                    setTimeout(() => {
                        formMessage.classList.remove('active');
                    },5000)
                } else {
                    formMessage.textContent = systemMessage.errorLoadForm;
                    formMessage.classList.add('active');
                    setTimeout(() => {
                        formMessage.classList.remove('active');
                    },4000)
                }
            } else {
                errorMessage.textContent = systemMessage.errorValueInput;
                form.append(errorMessage);
                setTimeout(() => {
                    errorMessage.remove();
                }, 4000);
            }
        }

        function formValidate(form){
            let error = 0;
            let formReq = document.querySelectorAll('.req');
            formReq.forEach( input => {
                formRemoveError(input);
                if (input.classList.contains('form-mail')) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
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
    }
    forms();
});