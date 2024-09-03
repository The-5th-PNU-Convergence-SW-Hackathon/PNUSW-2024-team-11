let mapObject;
const mapContainer = document.getElementById('map');
const placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
const contentNode = document.createElement('div');
const markers = [];
let currCategory = '';
let ps; // PlaceService instance
// 새로운 맛집 목록 배열
const userPlaces = [];

// 페이지가 로드될 때 지도 초기화 및 리레이아웃 호출
window.addEventListener('load', function() {
    loadMap(35.231627519785306, 129.08401651005062);
});

// 화면 크기 조정 시 리레이아웃 호출
window.addEventListener('resize', function() {
    if (mapObject) {
        mapObject.relayout();
    }
});

// post-button 클릭 시 폼 표시
document.querySelector('.post-button').addEventListener('click', function() {
    document.getElementById('markerForm').style.display = 'block';

    // 폼이 나타난 후 지도 리레이아웃
    setTimeout(() => {
        if (mapObject) {
            mapObject.relayout();
        }
    }, 0);
});

// 폼 닫기 버튼 클릭 시 폼 숨기기
document.getElementById('closeFormButton').addEventListener('click', function() {
    document.getElementById('markerForm').style.display = 'none';

    // 폼이 사라진 후 지도 리레이아웃
    setTimeout(() => {
        if (mapObject) {
            mapObject.relayout();
        }
    }, 0);
});

// 마커 추가 버튼 클릭 시 마커 생성
document.getElementById('addMarkerButton').addEventListener('click', function() {
    const placeName = document.getElementById('placeName').value;
    const placeLat = parseFloat(document.getElementById('placeLat').value);
    const placeLng = parseFloat(document.getElementById('placeLng').value);

    if (placeName && !isNaN(placeLat) && !isNaN(placeLng)) {
        const newPlace = { title: placeName, lat: placeLat, lng: placeLng };
        userPlaces.push(newPlace);
        addMarker(new kakao.maps.LatLng(placeLat, placeLng), null, placeName);

        // 폼 초기화 및 숨기기
        document.getElementById('placeName').value = '';
        document.getElementById('placeLat').value = '';
        document.getElementById('placeLng').value = '';
        document.getElementById('markerForm').style.display = 'none';

        // 폼이 사라진 후 지도 리레이아웃
        setTimeout(() => {
            if (mapObject) {
                mapObject.relayout();
            }
        }, 0);
    } else {
        alert('모든 필드를 정확히 입력하세요.');
    }
});

const advertisePlaces = [
    { title: "더크로와상", lat: 35.231719, lng: 129.084797 },
    { title: "강다짐", lat: 35.231841, lng: 129.084423 }
];

const loadMap = (lat, lng) => {
    const mapOptions = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 1, // 적당한 레벨로 설정
        mapTypeId: kakao.maps.MapTypeId.ROADMAP,
    };

    mapObject = new kakao.maps.Map(mapContainer, mapOptions);

    const markerPosition = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({
        position: markerPosition
    });
    marker.setMap(mapObject);

    // Initialize Places service after map is loaded
    ps = new kakao.maps.services.Places(mapObject);

    // 지도 로드 후 리레이아웃
    setTimeout(() => {
        if (mapObject) {
            mapObject.relayout();
        }
    }, 0);
};

contentNode.className = 'placeinfo_wrap';
addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);
placeOverlay.setContent(contentNode);

addCategoryClickEvent();

function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent('on' + type, callback);
    }
}

function searchPlaces() {
    placeOverlay.setMap(null);
    removeMarker();

    const searchInput = document.querySelector('.search_container input');
    const keyword = searchInput ? searchInput.value.trim() : '';

    if (!currCategory && !keyword) {
        // 디폴트 검색: 부산대 맛집
        ps.keywordSearch('부산대 맛집', function(data, status) {
            if (status === kakao.maps.services.Status.OK) {
                displayAdvertisePlaces(); // 광고 장소를 기본 검색 시 표시
                displayUserPlaces(); // 사용자가 등록한 맛집 표시
                displayPlaces(data);
            } else {
                console.error("Error occurred while searching for default places. Status: ", status);
            }
        });
        return;
    }

    if (keyword) {
        // 사용자가 입력한 검색어로 검색
        ps.keywordSearch(keyword, function(data, status) {
            if (status === kakao.maps.services.Status.OK) {
                displayPlaces(data);
            } else {
                console.error("Error occurred while searching for keyword. Status: ", status);
            }
        });
    } else if (currCategory) {
        if (currCategory === 'store') {
            ps.categorySearch('CS2', placesSearchCB, { useMapBounds: true });
            ps.categorySearch('MT1', placesSearchCB, { useMapBounds: true });
        } else if (currCategory === 'health') {
            ps.categorySearch('HP8', placesSearchCB, { useMapBounds: true });
            ps.categorySearch('PM9', placesSearchCB, { useMapBounds: true });
        } else {
            ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
        }
    }
}

// 사용자가 등록한 맛집을 지도에 표시하는 함수
function displayUserPlaces() {
    for (const place of userPlaces) {
        const position = new kakao.maps.LatLng(place.lat, place.lng);
        addMarker(position, null, place.title);
    }
}

function placesSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        console.log("No results found.");
    } else if (status === kakao.maps.services.Status.ERROR) {
        console.error("Error occurred while searching places. Status: ", status);
    }
}

function displayPlaces(places) {
    console.log("Displaying places:", places); // Check the search results

    if (!places || places.length === 0) {
        console.log("No places to display.");
        return;
    }

    for (let i = 0; i < places.length; i++) {
        const position = new kakao.maps.LatLng(places[i].y, places[i].x);
        const isAdvertisePlace = advertisePlaces.some(ad => ad.lat === position.getLat() && ad.lng === position.getLng());

        if (isAdvertisePlace) {
            // 광고 장소인 경우 광고 마커로 표시
            addMarker(position, null, places[i].place_name);
        } else {
            // 일반 장소인 경우 카테고리별 마커로 표시
            const marker = addMarker(position, currCategory, places[i].place_name);

            (function(marker, place) {
                kakao.maps.event.addListener(marker, 'click', function() {
                    displayPlaceInfo(place);
                });
            })(marker, places[i]);
        }
    }
}

function addMarker(position, category, placeName) {
    let imageSrc;

    // 광고 장소인지 확인 
    const isAdvertisePlace = advertisePlaces.some(ad => ad.lat === position.getLat() && ad.lng === position.getLng());

    if (isAdvertisePlace) {
        // 광고 장소인 경우 광고 마커 이미지 사용
        imageSrc = '/pict/map/advertisement.png';
    } else if (category === 'FD6') {
        imageSrc = '/pict/map/food.png';
    } else if (category === 'CE7') {
        imageSrc = '/pict/map/cafe.png';
    } else if (category === 'store') {
        imageSrc = '/pict/map/mart.png';
    } else if (category === 'health') {
        imageSrc = '/pict/map/hospital.png';
    } else {
        imageSrc = '/pict/map/default.png'; // 디폴트 마커 이미지
    }

    const imageSize = new kakao.maps.Size(27, 28);
    const imgOptions = { offset: new kakao.maps.Point(13, 28) };

    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
    const marker = new kakao.maps.Marker({
        position: position,
        image: markerImage
    });

    marker.setMap(mapObject);
    markers.push(marker);

    return marker;
}

// 광고 장소를 표시하는 함수
function displayAdvertisePlaces() {
    for (const place of advertisePlaces) {
        const position = new kakao.maps.LatLng(place.lat, place.lng);
        addMarker(position, null, place.title);
    }
}

function removeMarker() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function displayPlaceInfo(place) {
    var content = '<div class="placeinfo">' +
        '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';

    if (place.road_address_name) {
        content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
            '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
    } else {
        content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
    }

    content += '    <span class="tel">' + place.phone + '</span>' +
        '</div>' +
        '<div class="after"></div>';

    contentNode.innerHTML = content;
    placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(mapObject);
}

function addCategoryClickEvent() {
    const category = document.getElementById('category');
    const children = category.children;

    for (let i = 0; i < children.length; i++) {
        children[i].onclick = onClickCategory;
    }
}

function onClickCategory() {
    const id = this.id;
    const className = this.className;

    placeOverlay.setMap(null);

    if (className === 'on') {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
    } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
    }

    // 카테고리 클릭 후 지도 리레이아웃
    setTimeout(() => {
        if (mapObject) {
            mapObject.relayout();
        }
    }, 0);
}

function changeCategoryClass(el) {
    const category = document.getElementById('category');
    const children = category.children;

    for (let i = 0; i < children.length; i++) {
        children[i].className = '';
    }

    if (el) {
        el.className = 'on';
    }
}
