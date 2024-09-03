var pq=new Array(); //우선순위 큐를 만들기 위한 배열을 생성한다.
var lineList = new Array(); //길을 찾을 경우
var map, gps_status = false, place_point, mode = 1;
var point_list = new Array();
var point_my_location, point_away_location = new naver.maps.Circle({
    strokeColor: '#64FF64',
    fillColor: '#64FF64',
    fillOpacity: 0.5
});

function pq_push(value){ //우선순위 큐 삽입하기
    var index=pq.length; //인덱스를 우선순위 큐의 인자 삽입 전 길이로 지정한다. 이러면 인덱스는 새로 들어가는 인자의 위치와 같아진다.
    pq.push(value); //새로운 값을 pq에 넣는다.
    while(true){ //새로 들어간 값이 제자리를 찾을때까지 반복한다.
        parent=parseInt((index-1)/2); //부모 노드의 위치를 찾는다.(해당 우선순위큐는 0부터 시작하므로 구하는 식이 (현재 인자 위치-1)/2를 한 몫과 같다.)
        if(pq[parent]["len"]<=pq[index]["len"]||index==0) break; //만약 새로운 인자가 최고점에 도달하거나(이진 트리 기준), 이동거리가 부모 노드보다 클 경우 제자리를 찾은것이므로 종료한다.
        var temp=JSON.parse(JSON.stringify(pq[parent])); //만약 새로운 인자가 부모 노드보다 이동거리가 짧을 경우 두 노드의 위치를 바꾼다.
        pq[parent]=JSON.parse(JSON.stringify(pq[index]));
        pq[index]=JSON.parse(JSON.stringify(temp));
        index=parent; //새로운 인자의 위치는 과거 부모 노드의 위치와 같다.
    }
};

function pq_pop(){ //우선순위큐 최고점 반환 및 재정렬
    if(pq.length==0) return; //우선순위큐가 비었다면 아무것도 반환하지 않는다.
    if(pq.length==1) return pq.pop(); //우선순위큐에 인자가 하나뿐이라면 해당 인자를 반환한다.
    const top=pq[0]; //우선순위큐의 최고점을 미리 저장해놓는다.
    pq[0]=pq.pop(); //우선순위큐(또는 힙)의 작동 방식에 따라 최고점에 제일 뒤 인자를 삽입한다. 이때 제일 뒤 인자를 제거해야하므로 pop을 사용한다.
    const last=pq.length; //우선순위큐의 길이 밖으로 나가면 안되므로 해당 길이를 저장한다.
    var index=0; //자리를 찾아야하는 노드의 초기위치는 0이다.
    while(true){ //노드가 제자리를 찾을때까지 반복한다.
        var left=index*2+1; //각 자식 노드의 위치를 각각 다른 변수에 저장한다.
        var right=index*2+2;
        if((left<last&&pq[left]["len"]>=pq[index]["len"]&&(right<last&&pq[right]["len"]>=pq[index]["len"]||right>=last))||left>=last) break;
        //만약 왼쪽이 존재하지 않거나, 왼쪽만 존재하면서 왼쪽이 자신보다 크거나, 좌우가 모두 있으면서 좌우 모두 자신보다 클 경우 제자리를 찾은 것이므로 종료한다.
        if(right>=last||pq[left]["len"]<=pq[right]["len"]){
            var temp=JSON.parse(JSON.stringify(pq[index])); //왼쪽이 더 작거나 같으므로 오른쪽과 자신의 위치를 교환한다.
            pq[index]=JSON.parse(JSON.stringify(pq[left]));
            pq[left]=JSON.parse(JSON.stringify(temp));
            index=left; //이제 위치를 찾아야할 노드의 위치는 과거 왼쪽 노드의 위치와 같다.
        }
        else{
            var temp=JSON.parse(JSON.stringify(pq[index])); //오른쪽이 더 작으므로 오른쪽과 자신의 위치를 교환한다.
            pq[index]=JSON.parse(JSON.stringify(pq[right]));
            pq[right]=JSON.parse(JSON.stringify(temp));
            index=right; //이제 위치를 찾아야할 노드의 위치는 과거 오른쪽 노드의 위치와 같다.
        }
    }
    return top; //저장해놓은 최고점 값을 호출한 위치로 반환한다.
}

var numData=Area[0]; //동 번호의 좌표를 가져온다.
var placeData=Area[1]; //건물 이름과 동 번호를 일치시킨 데이터를 가져온다.
var nodeData=len; //각 정점 별 거리 데이터인 노드를 가져온다.
var pointData=point; //각 정점별 좌표를 가져온다.
var placePointData=placePoint; //각 건물별 출/도착지점 좌표를 가져온다.

var PNU = new naver.maps.LatLngBounds( //지도의 경계 설정
    new naver.maps.LatLng(35.229778, 129.073079),
    new naver.maps.LatLng(35.239386, 129.084704)); //부산대의 건물만 탐색하도록, 부산대의 최상/하/좌/우 경계를 설정한다.

function findplace(w){ //w에 id 값을 받아 검색한 지점으로 지도 변경
    let place=document.getElementById(w).value; //input 지점의 id를 w로 받으므로, w를 id로 가진 input의 데이터를 가져온다.
    if(place==""){
        alert("값을 입력해주세요.");
        return;
    }
    if(place.length>=3&&place.length<=4&&isitnum(place)){ //만약 입력이 숫자로만 이루어져있거나 숫자+동으로 이루어진 경우
        place=place[0]+place[1]+place[2];
        if(!Object.keys(numData).includes(place)) {
            alert("입력이 잘못되었습니다.");
            return;
        }
    }
    else { //건물명이 입력으로 들어온 경우
        if(Object.keys(placeData).includes(place)){ //건물 이름 데이터에서 입력과 동일한 키 값이 있다면
            place = placeData[place];
        }
        else{
            alert("입력이 잘못되었습니다."); //입력에 해당하는 키 값이 없다면 오류를 출력한다.
            return;
        }
    } 
    change_center(numData[place][0], numData[place][1]);
    if(place_point === undefined) {
        place_point = new naver.maps.Marker({
            map: map, //마커를 넣을 지도를 위에서 만든 map으로 지정한다.
            position: new naver.maps.LatLng(numData[place][0], numData[place][1]) //건물의 위치를 알려줄 마커를 함수에서 받은 인자 y, x로 지정한다.
        });
    }
    else {
        place_point.setPosition(new naver.maps.LatLng(numData[place][0], numData[place][1]));
    }
};

function isitnum(chk){ //chk가 동 번호를 입력한 것인지 확인
    if(chk.length==4) //길이가 4인 경우
    {
        return (!isNaN(chk[0]+chk[1]+chk[2]))&&chk[3]=="동"//앞의 세 글자가 숫자이며 뒷 글자가 동인지에 해당하는 참거짓을 반환한다.
    }
    return !isNaN(chk[0]+chk[1]+chk[2])//길이가 3인 경우(애초에 3 또는 4만 들어올 수 있으므로) 글자가 모두 숫자인지 확인하여 참거짓을 반환한다.
};

function change_to_findroad(){ //길찾기 버튼을 누른 경우 경로 찾기 모델을 보여주고 건물 찾기 모델을 숨긴다.
    $("#findplace").hide();
    $("#findroad").show();
    $("#findroadclick").show();
    document.getElementById("placestart").value=""; //입력창 값을 초기화한다.
    document.getElementById("placedesti").value="";
};

function change_to_findplace(){ //건물 찾기 버튼을 누른경우 건물 찾기 모델을 보여주고 경로 찾기 모델을 숨긴다.
    $("#findroad").hide();
    $("#findroadclick").hide();
    $("#findplace").show();
    document.getElementById("place").value=""; //입력창 값을 초기화한다.
};

function change_center(y, x){ //y, x를 중심으로 지도를 변경
    map.setZoom(18, true);
    map.panTo(new naver.maps.LatLng(y, x));
};

function enterchk(e){ //input type이 text인 부분에서 enter를 입력하였는지 확인
    if(e.keyCode == 13) { // enter는 13이므로 enter 입력시
        findplace(e.srcElement.id); //장소 찾기 실행(이때 enter를 누른 input의 id 가져오기)
        return false; // 추가적인 이벤트 실행을 방지하기 위해 false 리턴
    } else {
        return true;
    }
};

function map_clear(x, y){ //지도 초기화
    document.getElementById("map").innerHTML=""; //기존에 만들어진 지도를 제거한다.
    var mapOptions = {
        center: new naver.maps.LatLng(x, y),
        zoom: 16, //배율을 16(읍면동 레벨)으로 지정한다.
        minZoom: 15, //최소 배율을 15으로 지정한다.
        // maxBounds: PNU //최대 범위를 위에서 지정한 PNU로 지정한다.
    };
    map = new naver.maps.Map('map', mapOptions); //id가 map인 인자에 mapOptions를 조건으로 네이버 지도를 생성한다.
    naver.maps.Event.addListener(map, 'zoom_changed', function (zoom) {
        point_my_location.setRadius(3.5 * Math.pow(2, (18 - zoom)));
        point_away_location.setRadius(3.5 * Math.pow(2, (18 - zoom)));
    });
};

$(document).ready(function(){ //html에서 id가 map인 인자에 네이버 지도를 넣어야하는데, 이를 위해 먼저 html에서 id가 map인 인자의 선언이 필요하므로 문서의 로딩 이후 실행한다.
    navigator.geolocation.getCurrentPosition(async pos => {
        map_clear(pos.coords.latitude, pos.coords.longitude); // 초기 지도 현위치를 중심으로 생성한다.
        point_my_location = new naver.maps.Circle({
            center: new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            radius: 3.5 * Math.pow(2, (18 - map.getZoom())),
            fillColor: '#007EEA',
            fillOpacity: 0.5
        });
        gps_status = true;
        navigator.geolocation.watchPosition(pos => {
            point_my_location.setCenter(new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            gps_status = true;
            if(away_online) socket.emit('location', pos.coords);
        }, error => {
            console.error(error);
            alert('실시간 위치 추적에 실패했습니다.');
            gps_status = false;
        }, {
            enableHighAccuracy: true, // 정확도 우선 모드
            timeout: 10000,           // 10초 이내에 응답 없으면 에러 발생
            maximumAge: 0             // 항상 최신 위치 정보 수집
        });
    }, err => {
        console.error(err);
        map_clear(35.234226, 129.078787); //초기 지도 부산대학교를 중심으로 생성한다.
    }, { enableHighAccuracy: true });
    $("#findroad").hide(); //초기에는 버튼을 누르지 않을 경우 부산대 지도만 나오도록 입력창을 감춘다.
    $("#findplace").hide();
    $("#findroadclick").hide();
});

function makeroad(value, ans_len){ //찾은 경로를 지도에 표시
    if(ans_len>500){ //만약 거리가 500m가 넘을 경우 배율을 16으로 조정한다.
        map.setZoom(16, true);
    }
    else {
        map.setZoom(17, true);
    }
    map.panTo(new naver.maps.LatLng(pointData[value[parseInt(value.length/2)]][0], pointData[value[parseInt(value.length/2)]][1]));
    for(var i=0; i<value.length-1; i++){ //입력받은 경로의 정점 개수-1 만큼 for문을 돌린다.(시작 정점과 이후 정점을 사용하므로 정점 개수만큼 돌리면 마지막 정점에서 에러가 난다.)
        lineList.push(new naver.maps.Polyline({ //그릴 폴리라인 설정을 한다.
            map: map, //위에서 만든 지도에 그린다.
            path: [ //앞 정점과 그 다음 정점을 좌표로 삼는다.
                new naver.maps.LatLng(pointData[value[i]][0], pointData[value[i]][1]),
                new naver.maps.LatLng(pointData[value[i+1]][0], pointData[value[i+1]][1])
            ]
        })); //만든 폴리라인을 전역변수로 선언한 배열에 집어넣음으로써 제거되지 않도록 한다.
    }
    
};

function findroad(){ //출발점부터 도착점까지의 최단 거리 찾기
    let placestart=document.getElementById("placestart").value; //출발지와 도착지 입력값을 받아온다.
    let placedesti=document.getElementById("placedesti").value;
    var finish = []; //시작과 끝 정점을 받아올 변수를 미리 생성한다.
    var start = [];
    let ans, ans_len;
    clear_overlay();
    if(placestart==""&&placedesti==""){ //만약 출발지와 도착지를 입력하지 않았을 경우 에러창을 출력한다.
        if(!mode) {
            alert("출발지와 도착지를 입력해주세요.");
            return;
        }
        if(!away_online || !gps_status){
            alert("GPS가 수신되지 않거나 상대방이 오프라인입니다. 출발지와 도착지를 입력해주세요.");
            return;
        }
        start.push(find_closest_point(point_my_location.getCenter()));
        finish.push(find_closest_point(point_away_location.getCenter()));
        [ans, ans_len] = find_pq(start, finish);
        if(ans_len == -1) return;
        ans_len += get_length_gps(pointData[start[0]], point_my_location.getCenter());
        ans_len += get_length_gps(pointData[finish[0]], point_away_location.getCenter());
        push_point_list(point_my_location.getCenter());
        push_point_list(point_away_location.getCenter());
    }
    else if(placedesti==""){ //만약 도착지를 입력하지 않았을 경우 에러창을 출력한다.
        if(!mode) {
            alert("도착지를 입력해주세요.");
            return;
        }
        if(!away_online){
            alert("상대방이 오프라인입니다. 도착지를 입력해주세요.");
            return;
        }
        start = get_placeData(placestart);
        if(start == -1) return;
        finish.push(find_closest_point(point_away_location.getCenter()));
        [ans, ans_len] = find_pq(start, finish);
        if(ans_len == -1) return;
        ans_len += get_length_gps(pointData[finish[0]], point_my_location.getCenter());
        push_point_list(new naver.maps.LatLng(pointData[ans[0]][0], pointData[ans[0]][1]));
        push_point_list(point_away_location.getCenter());
    }
    else if(placestart==""){ //만약 출발지를 입력하지 않았을 경우 에러창을 출력한다.
        if(!mode) {
            alert("출발지를 입력해주세요.");
            return;
        }
        if(!gps_status) {
            alert("GPS가 수신되지 않습니다. 출발지를 입력해주세요.");
            return;
        }
        // console.log(point_my_location.getCenter()); _lat, _lng가 있음.
        finish = get_placeData(placedesti);
        if(finish == -1) return;
        start.push(find_closest_point(point_my_location.getCenter()));
        [ans, ans_len] = find_pq(start, finish);
        if(ans_len == -1) return;
        ans_len += get_length_gps(pointData[start[0]], point_my_location.getCenter());
        push_point_list(point_my_location.getCenter());
        push_point_list(new naver.maps.LatLng(pointData[ans[ans.length - 1]][0], pointData[ans[ans.length - 1]][1]));
    }
    else {
        start = get_placeData(placestart);
        finish = get_placeData(placedesti);
        if(start == -1 || finish == -1) return;
        [ans, ans_len] = find_pq(start, finish);
        if(ans_len == -1) return;
        push_point_list(new naver.maps.LatLng(pointData[ans[0]][0], pointData[ans[0]][1]));
        push_point_list(new naver.maps.LatLng(pointData[ans[ans.length - 1]][0], pointData[ans[ans.length - 1]][1]));
    }
    
    makeroad(ans, ans_len); //찾은 최단거리 정점 배열과 길이를 폴리라인 생성 함수에 보낸다.
};

function find_closest_point(choods) {
    let min = Infinity, ret, lat = choods._lat, lng = choods._lng;
    for(let i = 0; i < point.length; i++) {
        let dist = Math.sqrt(Math.pow(Math.abs(point[i][0] - lat), 2) + Math.pow(Math.abs(point[i][1] - lng), 2));
        if(min > dist) {
            min = dist;
            ret = i;
        }
    }
    return ret;
}

function get_placeData(value) {
    if(value.length>=3&&value.length<=4&&isitnum(value)) { //만약 도착지 입력이 숫자로만 이루어져있거나 숫자+동으로 이루어진 경우
        value=value[0]+value[1]+value[2]; //숫자에 해당하는 부분만 추출한다.
        if(Object.keys(numData).includes(value)){ //입력에 해당하는 키 값이 있다면
            return placePointData[value];
        }
        else{
            alert("도착지 입력이 잘못되었습니다.");
            return -1;
        }
    }
    else { //만약 도착지 입력이 글자로만 이루어진 경우
        if(Object.keys(placeData).includes(value)){ //입력에 해당하는 키 값이 있다면
            return placePointData[placeData[value]]; //도착 위치에 해당하는 동 숫자를 저장한다.
        }
        else{
            alert("도착지 입력이 잘못되었습니다.");
            return -1;
        }
    }
}

function push_point_list(value) {
    point_list.push(new naver.maps.Marker({
        map: map, //마커를 넣을 지도를 위에서 만든 map으로 지정한다.
        position: new naver.maps.LatLng(value._lat, value._lng) //건물의 위치를 알려줄 마커를 함수에서 받은 인자 y, x로 지정한다.
    }));
}

function find_pq(start, finish) {
    for(var i=0; i<start.length; i++){ //출발지와 도착지가 같은지 검사한다.
        for(var j=0; j<finish.length; j++){
            if(start[i]==finish[j]){ //출발지와 도착지가 같은 경우 에러를 출력한다.
                alert("출발지와 도착지가 같습니다.");
                return [-1, -1];
            }
        }
    }   
    var visit=Array(500).fill(0); //해당 정점에 이미 도착했는지 검사할 배열
    var leng=Array(500).fill(Infinity); //해당 정점까지 도달하는데 걸리는 길이를 저장할 배열
    for(var i=0; i<start.length; i++){ //시작 정점을 길이 0으로 초기화 하고 정점 리스트를 생성한 후 우선순위큐에 삽입한다.
        var temp={
            len: 0,
            arr: [start[i]]
        };
        pq_push(temp);
    }
    var ans = new Array(); //최단거리로 도달하는 경우의 정점 배열을 저장할 배열
    var ans_len=Infinity; //도착지까지 최단거리로 도달하는지 검사하는 용도의 무한대 생성

    while(pq.length){ //pq를 모두 소진할때까지 연산한다.
        var now=pq_pop(); //최상위 노드를 우선순위큐에서 가져온다.
        nowPoint=now["arr"][now["arr"].length-1]; //현재 정점의 위치를 가져온다.
        if(visit[nowPoint]==1) continue; //해당 정점을 방문한 경우 더이상 작동하지 않아도 되도록 한다.
        for(var i=0; i<finish.length; i++){ //현재 정점이 목적지 정점과 같은지 확인하기 위해 목적지 정점의 개수만큼 for문을 돌린다.
            if(nowPoint==finish[i]&&ans_len>now["len"]){ //만약 현재 정점이 목적지 정점이며 현재 목적지까지의 최단거리보다 현재까지의 이동거리가 짧은 경우
                ans=JSON.parse(JSON.stringify(now["arr"])); //최단거리 정점 배열에 현재 정점 배열을 복사한다.
                ans_len=now["len"]; //최단거리 변수에 현재까지의 이동거리를 저장한다.
                break; // 더 이상 목적지 배열을 검사할 필요가 없으므로 for문을 종료한다.
            }
        }
        visit[nowPoint]=1; //현재 정점은 방문하였으므로 visit의 값을 1로 설정한다.
        var go=Object.keys(nodeData[Number(nowPoint)]); //현재 정점에서 갈수 있는 다음 정점을 배열로 받는다.(nodeData에 키로 다음 정점까지의 거리가 구해져있다.)
        for(var i=0; i<go.length; i++){ //다음 정점의 개수만큼 for문을 돈다.
            ngo=Number(go[i]); //다음 정점의 값을 정수로 바꾼다.
            if(visit[ngo]==1) continue; //만약 다음 정점을 이미 방문한 경우 다른 다음 정점을 찾는다.
            var temp=JSON.parse(JSON.stringify(now)); //현재 오브젝트를 복사한다.
            temp["arr"].push(ngo); //다음 정점의 위치를 정점 배열에 넣어준다.
            temp["len"]+=nodeData[Number(nowPoint)][go[i]]; //현재 위치에서 다음 정점까지의 거리를 현재까지의 거리에 더해준다.
            if(leng[ngo]>temp["len"]){ //다음 정점까지의 거리가 원래 다음 정점까지의 거리보다 짧을경우
                leng[ngo]=temp["len"]; //다음 정점까지의 최단거리를 바꾼다.
                pq_push(temp); //해당 오브젝트를 우선순위큐에 추가한다.(따라서 다음 정점에서 시작할 값은 이번에 삽입한 값으로 바뀐다.)
            }
        }
    }
    return [ans, ans_len];
}

function get_length_gps(f, b) {
    let line = new naver.maps.Polyline({
        map: map, //위에서 만든 지도에 그린다.
        path: [ //앞 정점과 그 다음 정점을 좌표로 삼는다.
            new naver.maps.LatLng(f[0], f[1]),
            new naver.maps.LatLng(b._lat, b._lng),
        ]
    });
    let length = line.getDistance();
    lineList.push(line);
    return length;
}

function clear_overlay() {
    for(i of lineList) {
        i.setMap(null);
    }
    for(i of point_list) {
        i.setMap(null);
    }
    lineList = new Array();
    point_list = new Array();
    if(place_point !== undefined) place_point.setMap(null);
}

const socket = io();
let away_online = false;
socket.emit('navigation', '');
socket.on('mode', data => {
    mode = data;
})
// away online
socket.on('status', data => {
    away_online = data == 2;
});

socket.on('location', data => {
    point_away_location.setCenter(new naver.maps.LatLng(data.latitude, data.longitude));
});