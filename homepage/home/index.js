let currentPage = 0;
const postsPerPage = 10;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight >= bodyHeight - 100) {
        // loadPosts();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // loadPosts();
    window.addEventListener('scroll', handleScroll);
});

if('serviceWorker' in navigator) {
    // let today = new Date();
    // let nowTime = "?ver=" + today.getTime();
    navigator.serviceWorker
    .register('./service_worker.js'/*  + nowTime */)
    // .then(() => console.log('서비스 워커 등록!'));
}