$(document).ready(() => {
    let USER = [];
    let selectedFilters = {};

    // Function to fetch roommates based on selected filters
    const fetchRoommates = (filters) => {
        $.ajax({
            url: '/matching/get_roommate',
            method: 'GET',
            data: filters,
            success: (response) => {
                $.ajax({
                    url: "/ajax/session/profile",
                    type: 'POST',
                    dataType: 'JSON',
                    data: {}
                })
                .done(userInfo => {
                    USER = userInfo;
                    const Major = USER[1];
                    const YearPart = USER[2].substring(2, 4);
                    displayRoommates(response, Major, YearPart);
                })
                .fail((xhr, status, error) => console.log(error));
            },
            error: (error) => {
                console.error("Error fetching roommate data:", error);
            }
        });
    };

    const displayRoommates = (data, Major, YearPart) => {
        const listContainer = $("#roommate-list");
        listContainer.empty();

        data.forEach(roommate => {
            const post = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${Major} ${YearPart}</h5>
                            <details class="roommate-details">
                                <summary>${roommate.COMMENT}</summary>
                                <p class="card-text"><strong>흡연 여부 : </strong> ${roommate.SMOKING === 1 ? '흡연' : '비흡연'}</p>
                                <p class="card-text"><strong>음주 빈도 : </strong> ${roommate.DRINKING_FREQUENCY}</p>
                                <p class="card-text"><strong>수면 패턴 : </strong> ${roommate.SLEEP_PATTERN}</p>
                                <p class="card-text"><strong>잠버릇 : </strong> ${roommate.SLEEP_HABIT}</p>
                                <p class="card-text"><strong>룸메의 지인 방문 : </strong> ${roommate.GUEST_VISIT === 0 ? '불가능' : roommate.GUEST_VISIT === 1 ? '상관X' : '사전 허락'}</p>
                                <button class="chat-button" data-roommate-id="${roommate.ID}">채팅하기</button>
                            </details>
                        </div>
                    </div>
                </div>
            `;
            listContainer.append(post);
        });
    };

    // Handle dorm radio button change
    $('input[name="dorm"]').on('change', () => {
        selectedFilters.dorm = $('input[name="dorm"]:checked').val() || '';
        fetchRoommates(selectedFilters);
    });

    // Handle filter form submission
    document.getElementById('filterForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form submission

        // Collect selected filter values
        const getCheckedValues = (name) => {
            return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(checkbox => checkbox.value);
        };

        selectedFilters = {
            dorm: $('input[name="dorm"]:checked').val() || '',
            smokings: getCheckedValues('smoking').join(','),
            drinking_frequencies: getCheckedValues('drinking_frequency').join(','),
            sleep_patterns: getCheckedValues('sleep_pattern').join(','),
            sleep_habits: getCheckedValues('sleep_habit').join(','),
            guest_visits: getCheckedValues('guest_visit').join(',')
        };

        fetchRoommates(selectedFilters);

        // Close modal after applying filters
        document.getElementById('filterModal').style.display = 'none';
    });

    // Filter item click handler to toggle 'active' class
    document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', () => {
            filter.classList.toggle('active');
        });
    });

    // Get modal elements
    const modal = document.getElementById('filterModal');
    const filterButton = document.getElementById('filterButton');
    const closeButton = document.querySelector('.close-button');

    // Open the modal
    filterButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close the modal
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Handle chat button click
    $(document).on('click', '.chat-button', function() {
        const roommateId = $(this).data('roommate-id');
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    location.href = httpRequest.response.url;
                } else {
                    alert('Request failed.');
                }
            }
        };
        httpRequest.open('POST', '/board/chat', true);
        httpRequest.responseType = 'json';
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.send(JSON.stringify({id: roommateId}));
    });

    // Initial data load
    fetchRoommates(selectedFilters);
});