//comments
//투명상태에 있던 header bar를 header heigtht만큼 아래로 내리면 보여주기
const header = document.querySelector('.header');
const headerHeight = header.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    if (window.scrollY > headerHeight - 10) {
        header.classList.add('header--dark');
    }
    else {
        header.classList.remove('header--dark');
    }
});

//스크롤을 아래로 내리면 home 부분이 점점 사라지기
const home = document.querySelector('.home__container');
const homeHeight = home.offsetHeight;
document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight;
})

//home에서는 home으로 올라가는 화살표가 보이지 않기
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if (window.scrollY <= homeHeight/2) {
        arrowUp.style.opacity = 0;
    }
    else {
        arrowUp.style.opacity = 1;
    }
})