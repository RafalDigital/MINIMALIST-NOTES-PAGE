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

// INFO SECTION
const infoSection = document.querySelector('.info-section');
function handleFirstScroll(e) {
    let currentPosition = e.scroll;
    
    if (currentPosition > 0 && currentPosition < 200) {
        
        lenis.off('scroll', handleFirstScroll);

        lenis.scrollTo('#info', {
            duration: 1.5,
            lock: true
        });
        
        console.log("Lompatan dieksekusi!");
    }
}

lenis.on('scroll', handleFirstScroll);

const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting){
        entries[0].target.classList.add('show');
        observer.unobserve(entries[0])
    }
},{})
observer.observe(infoSection)