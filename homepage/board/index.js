const posts = [
    {
        title: 'Sample Post 1',
        content: 'This is a sample post content.',
        price: '19.99',
        category: 'Electronics',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 2',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 3',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 4',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 5',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 6',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 7',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 8',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 9',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 10',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 11',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    {
        title: 'Sample Post 12',
        content: 'This is another sample post content.',
        price: '29.99',
        category: 'Books',
        photos: ['https://via.placeholder.com/150']
    },
    // ... 추가 게시글들을 여기에 작성합니다 ... 여러개 대충 때려봤어요..
];

let currentPage = 0;
const postsPerPage = 10;

function loadPosts() {
    const container = document.getElementById('postsContainer');
    const start = currentPage * postsPerPage;
    const end = start + postsPerPage;
    const postsToDisplay = posts.slice(start, end);

    postsToDisplay.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <img src="${post.photos[0]}" class="post-image" alt="${post.title}">
            <div class="post-content">
                <h5>${post.title}</h5>
                <p>${post.content}</p>
                <p><strong>Price:</strong> $${post.price}</p>
                <p><strong>Category:</strong> ${post.category}</p>
            </div>
        `;
        container.appendChild(postElement);
    });

    currentPage++;
}

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
