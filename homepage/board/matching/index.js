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

$(document).ready(() => {
    $.ajax({
        url : "/ajax/matching",
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        console.log(json);
    })
    .fail(err => console.error(err));
});