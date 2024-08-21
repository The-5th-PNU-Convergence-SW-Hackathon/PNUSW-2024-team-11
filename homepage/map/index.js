let mapObject;
const mapContainer = document.getElementById('map');

const loadMap = (lat, lng) => {
    const mapOptions = {
        center: new kakao.maps.LatLng(lat, lng),
        level: 1,
        mapTypeId: kakao.maps.MapTypeId.ROADMAP,
    };

    mapObject = new kakao.maps.Map(mapContainer, mapOptions);

    const markerPosition = new kakao.maps.LatLng(lat, lng);
    const marker = new kakao.maps.Marker({
        position: markerPosition
    });
    marker.setMap(mapObject);

    mapObject.panTo(markerPosition);
};

loadMap(35.231627519785306, 129.08401651005062);

const placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
const contentNode = document.createElement('div');
const markers = [];
let currCategory = '';

const ps = new kakao.maps.services.Places(mapObject);

kakao.maps.event.addListener(mapObject, 'idle', searchPlaces);

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
    if (!currCategory) {
        return;
    }
    
    placeOverlay.setMap(null);
    removeMarker();
    
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

function placesSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        console.log("No results found.");
    } else if (status === kakao.maps.services.Status.ERROR) {
        console.error("Error occurred while searching places.");
    }
}

function displayPlaces(places) {
    const order = document.getElementById(currCategory).getAttribute('data-order');

    for (let i = 0; i < places.length; i++) {
        const marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

        (function(marker, place) {
            kakao.maps.event.addListener(marker, 'click', function() {
                displayPlaceInfo(place);
            });
        })(marker, places[i]);
    }
}

function addMarker(position, order) {
    const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png',
        imageSize = new kakao.maps.Size(27, 28),
        imgOptions = {
            spriteSize: new kakao.maps.Size(72, 208),
            spriteOrigin: new kakao.maps.Point(46, (order * 36)),
            offset: new kakao.maps.Point(11, 28)
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        });

    marker.setMap(mapObject);
    markers.push(marker);

    return marker;
}

function removeMarker() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function displayPlaceInfo(place) {
    let content = '<div class="placeinfo">' +
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
    
    if (!category) {
        console.error('Category element not found');
        return;
    }

    const children = category.children;

    for (let i = 0; i < children.length; i++) {
        children[i].onclick = onClickCategory;
    }
}

function onClickCategory() {
    const id = this.id,
        className = this.className;

    if (currCategory === id) {
        return;
    }

    currCategory = id;

    const categoryList = document.querySelectorAll('.top_menu_2 button');
    for (let i = 0; i < categoryList.length; i++) {
        categoryList[i].className = categoryList[i].className.replace(/on/, '');
    }

    this.className += ' on';
    searchPlaces();
}
