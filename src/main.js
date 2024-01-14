//comments
//get height of header
const header = document.querySelector('.header');
const headerHeight = header.getBoundingClientRect().height;


//get event whenever scrolling
document.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight - 10) {
        header.classList.add('header--dark');
    }
    else {
        header.classList.remove('header--dark');
    }
});

const home = document.querySelector('.home__container');
const homeHeight = home.offsetHeight;
document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
})