let currentPage = 0;
const postsPerPage = 10;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollTop + windowHeight >= bodyHeight - 100) {
        loadPosts();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    window.addEventListener('scroll', handleScroll);
});
