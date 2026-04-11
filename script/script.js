// LENIS INITIALIZATION
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);


// NAVBAR
const nav = document.querySelector('.navbar')
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 0);
});

// HERO SECTION
const cards = document.querySelectorAll('.card');
let isProcessing = false;

cards.forEach((c) => {
    c.addEventListener("mouseenter", () => {

        if(isProcessing) return;
    
        isProcessing = true;

        if (cards[0].classList.contains('p')) {
            console.log('c index 0 dipicu')
            cards[0].classList.remove("p");
            cards[1].classList.add("p");
        } else if (cards[1].classList.contains('p')) {
            console.log('c index 1 dipicu')
            cards[1].classList.remove("p");
            cards[0].classList.add("p");
        }

        setTimeout(() => {
            isProcessing = false;
        }, 1000);
    });
})

function infoClick() {
        lenis.scrollTo('#info', {
            duration: 1.5,
            lock: true,
            offset: -100
        });
}

// INFO SECTION
function handleFirstScroll(e) {
    let currentPosition = e.scroll;
    
    if (currentPosition > 0 && currentPosition < 200) {
        
        lenis.off('scroll', handleFirstScroll);

        lenis.scrollTo('#info', {
            duration: 1.5,
            lock: true,
            offset: -100
        });
        
        console.log("Lompatan dieksekusi!");
    }
}

lenis.on('scroll', handleFirstScroll);

// Selector
const infoSection = document.querySelector('.info-section');
const heroSection = document.querySelector('.hero-section');
const cta = document.querySelector('.cta');
const footer = document.querySelector('.footer');

// Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
},{ threshold: 0.2 })
observer.observe(infoSection);
observer.observe(heroSection);
observer.observe(cta);
observer.observe(footer);


