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
        const images = document.querySelectorAll('.slide-img');

        if ( images.length > 0) images.forEach(img => {
            img.addEventListener('click', () => {
                img.classList.add('show');
            })
        })
    }
    // form
/*     function forms () {
        const form = document.forms[0],
              formMessage = document.querySelector('.form-message'),
              formSpinner = document.querySelector('.form-spinner');
        
        if (form) form.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(form);
            fetch(form.action, {
                method: form.method,
                body: formData
            }).then(response => {
                formSpinner.classList.add('active');
                formMessage.classList.add('active');
                setTimeout(() => {
                    formSpinner.classList.remove('active');
                },3000)
                setTimeout(() => {
                    formMessage.classList.remove('active');
                },5000)
                form.reset();
            }).catch(error => {
                formMessage.textContent = "An error occurred while sending the message :("
                formMessage.classList.add('active');
                setTimeout(() => {
                    formMessage.classList.remove('active');
                },4000)
            });
        });
    }
    forms(); */
});