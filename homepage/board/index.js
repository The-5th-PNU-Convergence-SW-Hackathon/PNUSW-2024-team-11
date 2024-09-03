$(document).ready(() => {
    const defaultUrl = '/board/?sort=recent&order=desc';
    const currentUrlParams = new URLSearchParams(window.location.search);
    const currentSort = currentUrlParams.get('sort') || 'recent'; // 기본값으로 'recent'
    const currentOrder = currentUrlParams.get('order') || 'desc'; // 기본값으로 'desc'
    const currentCategory = currentUrlParams.get('category') || ''; // 기본값으로 전체 카테고리
    const currentSearchQuery = currentUrlParams.get('search') || '';

    if (!currentSort || !currentOrder) {
        window.location.href = defaultUrl;
    }
 
    let posts = [];
    let currentPage = 0;
    const postsPerPage = 10;
    let responseClone;
    let userClass = "";

    function fetchPosts(searchQuery) {
        fetch(`./posts?search=${encodeURIComponent(searchQuery)}`, {
            headers: { 'Accept': 'application/json' },
            method: 'GET',
        })
        .then(response => {
            responseClone = response.clone();
    
            // Redirect to login page if unauthorized
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            return response.json();
        })
        .then(data => {
            if (data) {
                posts = data.posts;
                userClass = data.userClass;
                applyCategoryFilter();
                currentPage = 0;
                applySortingAndFiltering();
                loadPosts(true);
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
    
            if (error.message.includes('502')) {
                alert('The server is currently unavailable (Bad Gateway). Please try again later.');
            } else {
                responseClone.text().then(bodyText => {
                    console.log('Received instead of valid JSON:', bodyText);
                });
            }
        });
    }

    function applyCategoryFilter() {
        const categoryMap = {
            'clothes': '의류',
            'book': '도서',
            'electronics': '전자기기'
        };

        const selectedCategory = categoryMap[currentCategory];
        if (selectedCategory) {
            if (selectedCategory === '도서') {
                // 도서 카테고리의 경우 전공이 같은 게시글만 필터링
                posts = posts.filter(post => post.category === selectedCategory && post.sellerClass === userClass);
            } else {
                // 그 외 카테고리 필터링
                posts = posts.filter(post => post.category === selectedCategory);
            }
        }
    }

    function timeAgo(date) {
        const now = new Date();
        const updatedDate = new Date(date);
        const diffInSeconds = Math.floor((now - updatedDate) / 1000);

        const seconds = diffInSeconds;
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) {
            return `${years} 년 전`;
        } else if (months > 0) {
            return `${months} 달 전`;
        } else if (days > 0) {
            return `${days} 일 전`;
        } else if (hours > 0) {
            return `${hours} 시간 전`;
        } else if (minutes > 0) {
            return `${minutes} 분 전`;
        } else {
            return `${seconds} 초 전`;
        }
    }

    function statusMap(status) {
        const statusMap = {
            "very_bad": '상태 매우 나쁨',
            "bad": '상태 나쁨',
            "average": '상태 보통',
            "good": '상태 좋음',
            "very_good": '상태 매우 좋음'
        };
        return statusMap[status] || '상태 알 수 없음';
    }

    function pricecomma(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function loadPosts(reset = false) {
        const container = document.getElementById('postsContainer');
        
        if (reset) {
            container.innerHTML = '';
        }
        
        const start = currentPage * postsPerPage;
        const end = start + postsPerPage;
        const postsToDisplay = posts.slice(start, end);
        
        postsToDisplay.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.setAttribute('data-product-id', post.productId);
            const isSoldOut = post.status === 'Sold Out'; // 판매완료 상태 체크
            const isReserved = post.status === 'Reserved'; // 예약중 상태 체크

            postElement.innerHTML = `
                <img src="${post.photos || 'https://via.placeholder.com/150'}" 
                class="post-image ${isSoldOut ? 'sold-out' : ''} ${isReserved ? 'sold-out' : ''} " 
                alt="${post.title}">
                ${isSoldOut ? '<span class="sold-out-text">판매완료</span>' : ''}
                ${isReserved ? '<span class="reserved-text">예약중</span>' : ''}
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <p class="post-time" style="color: grey;">${timeAgo(post.updatedAt)}</p>
                    <h3><strong>${pricecomma(post.price)}원</strong></h3>
                    <p class="post-info" style="color: grey;">${post.category} | ${statusMap(post.condition)}</p>
                    <p class="post-views" style="color: grey; text-align: right;"><strong>조회수</strong> ${post.views}</p>
                </div>
            `;
            
            postElement.addEventListener('click', () => {
                window.location.href = `/board/post/${post.productId}`;
            });
        
            container.appendChild(postElement);
        });
        
        currentPage++;
        if (end >= posts.length) {
            window.removeEventListener('scroll', handleScroll);
        } else {
            window.addEventListener('scroll', handleScroll);
        }
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.offsetHeight;

        if (scrollTop + windowHeight >= bodyHeight - 100) {
            loadPosts();
        }
    }

    function applySortingAndFiltering() {
        const sort = new URLSearchParams(window.location.search).get('sort') || 'recent';
        const order = new URLSearchParams(window.location.search).get('order') || 'desc';

        if (sort === 'popularity') {
            posts.sort((a, b) => {
                if (b.views === a.views) {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                }
                return b.views - a.views;
            });
        } else if (sort === 'recent') {
            posts.sort((a, b) => {
                if (order === 'asc') {
                    return new Date(a.updatedAt) - new Date(b.updatedAt);
                } else {
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                }
            });
        } else if (sort === 'price') {
            posts.sort((a, b) => {
                if (order === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        } else if (sort === 'condition') {
            const conditionOrder = ['very_good', 'good', 'average', 'bad', 'very_bad'];
            posts.sort((a, b) => {
                return conditionOrder.indexOf(a.condition) - conditionOrder.indexOf(b.condition);
            });
        }

        updateButtonStates(sort, order);
    }

    function updateButtonStates(sort, order) {
        $('.sort-button').removeClass('active'); // Remove active class from all buttons
        
        if (sort === 'popularity') {
            $('#sortPopularity').addClass('active');
        } else if (sort === 'recent') {
            $('#sortRecent').addClass('active');
            if (order === 'asc') {
                $('#sortRecent').text('오래된순'); // 최신순 버튼을 오래된순으로 변경
            } else {
                $('#sortRecent').text('최신순'); // 오래된순 버튼을 최신순으로 변경
            }
        } else if (sort === 'price') {
            $('#sortPrice').addClass('active');
            if (order === 'asc') {
                $('#sortPrice').text('낮은 가격순'); // 낮은 가격순 버튼을 높은 가격순으로 변경
            } else {
                $('#sortPrice').text('높은 가격순'); // 높은 가격순 버튼을 낮은 가격순으로 변경
            }
        } else if (sort === 'condition') {
            $('#filterCondition').addClass('active');
        }
    }

    function reloadPageWithParams(params) {
        const searchQuery = $('input[type="text"]').val() || currentSearchQuery;
        params.search = searchQuery;
        params.category = currentCategory; // 카테고리 파라미터를 추가합니다.
        const queryString = new URLSearchParams(params).toString();
        window.location.search = queryString;
    }

    $('#sortPopularity').on('click', () => {
        reloadPageWithParams({ sort: 'popularity', search: currentSearchQuery });
    });

    $('#sortRecent').on('click', () => {
        const params = new URLSearchParams(window.location.search);
        const currentOrder = params.get('order') === 'asc' ? 'desc' : 'asc';
        reloadPageWithParams({ sort: 'recent', order: currentOrder, search: currentSearchQuery });
    });

    $('#sortPrice').on('click', () => {
        const params = new URLSearchParams(window.location.search);
        const currentOrder = params.get('order') === 'asc' ? 'desc' : 'asc';
        reloadPageWithParams({ sort: 'price', order: currentOrder, search: currentSearchQuery });
    });

    $('#filterCondition').on('click', () => {
        reloadPageWithParams({ sort: 'condition', order: 'asc', search: currentSearchQuery });
    });

    $('#searchimg').on('click', () => {
        const searchQuery = $('input[type="text"]').val();
        fetchPosts(searchQuery);
    });

    // sorting buttons 상태 초기화 based on current URL parameters
    applySortingAndFiltering();
    fetchPosts(currentSearchQuery);
    window.addEventListener('scroll', handleScroll);
});
