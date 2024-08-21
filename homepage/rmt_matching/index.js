$(document).ready(() => {
    // 서버로부터 룸메이트 정보를 가져오는 함수
    let USER = [];

    const fetchRoommates = () => {
        $.ajax({
            url: '/matching/get_roommate',  // 서버의 라우트 경로와 일치해야 함
            method: 'GET',
            success: (response) => {
                $.ajax({ 
                    url: "/ajax/session/profile", // get login status 
                    type: 'POST', 
                    dataType: 'JSON', 
                    data: {} 
                })
                .done(userInfo => {
                    USER = userInfo;
                    const Major = USER[1]; // 학과 정보
                    const YearPart = USER[2].substring(2, 4); // 학번 정보
                    displayRoommates(response, Major, YearPart); // 학과와 학번 정보를 전달
                })
                .fail((xhr, status, error) => console.log(error));
            },
            error: (error) => {
                console.error("Error fetching roommate data:", error);
            }
        });
    };

    // 룸메이트 정보를 게시물 형태로 화면에 표시하는 함수
    const displayRoommates = (data, Major, YearPart) => {
        const listContainer = $("#roommate-list");
        listContainer.empty();

        data.forEach(roommate => {
            const post = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${Major} ${YearPart}</h5> <!-- 학과와 학번 표시 -->
                            <details>
                                <summary>ㅎㅇ</summary
                                <p class="card-text"><strong>Smoking:</strong> ${roommate.SMOKING === 1 ? 'Yes' : 'No'}</p>
                                <p class="card-text"><strong>Drinking Frequency:</strong> ${roommate.DRINKING_FREQUENCY}</p>
                                <p class="card-text"><strong>Sleep Pattern:</strong> ${roommate.SLEEP_PATTERN}</p>
                                <p class="card-text"><strong>Sleep Habit:</strong> ${roommate.SLEEP_HABIT}</p>
                                <p class="card-text"><strong>Guest Visit:</strong> ${roommate.GUEST_VISIT === 0 ? '불가능' : roommate.GUEST_VISIT === 1 ? '상관X' : '사전 허락'}</p>
                            </details>                        
                        </div>
                    </div>
                </div>
            `;
            listContainer.append(post);
        });
    };

    // 페이지 로드 시 룸메이트 정보를 가져옵니다.
    fetchRoommates();
});